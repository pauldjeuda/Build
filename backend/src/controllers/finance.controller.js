const { Op } = require('sequelize');
const { Depense, Facture, Chantier, Fournisseur, User, AchatCommande } = require('../models');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');

// ─── Dépenses ─────────────────────────────────────────────────────────────

async function listDepenses(req, res) {
  const where = {};
  if (req.query.chantier_id) where.chantier_id = req.query.chantier_id;
  if (req.query.categorie) where.categorie = req.query.categorie;
  if (req.query.from) where.date = { [Op.gte]: req.query.from };
  if (req.query.to) {
    where.date = { ...(where.date || {}), [Op.lte]: req.query.to };
  }

  const depenses = await Depense.findAll({
    where,
    include: [
      { model: Chantier, attributes: ['id', 'nom'] },
      { model: User, as: 'createur', attributes: ['id', 'name'] },
    ],
    order: [['date', 'DESC']],
  });
  return ok(res, depenses);
}

async function createDepense(req, res) {
  const { chantier_id, categorie, montant, description, date, reference_commande } = req.body;
  if (!chantier_id || !categorie || !montant || !date) {
    return badRequest(res, 'Champs obligatoires manquants');
  }

  const depense = await Depense.create({
    chantier_id, categorie, description,
    montant: parseFloat(montant),
    date, reference_commande,
    createur_id: req.user.id,
  });

  // Mettre à jour les dépenses du chantier
  const chantier = await Chantier.findByPk(chantier_id);
  if (chantier) {
    await chantier.increment('depenses', { by: parseFloat(montant) });
  }

  return created(res, depense, 'Dépense enregistrée');
}

// ─── Factures ─────────────────────────────────────────────────────────────

async function listFactures(req, res) {
  const where = {};
  if (req.query.chantier_id) where.chantier_id = req.query.chantier_id;
  if (req.query.status) where.status = req.query.status;
  if (req.query.fournisseur_id) where.fournisseur_id = req.query.fournisseur_id;

  const factures = await Facture.findAll({
    where,
    include: [
      { model: Chantier, attributes: ['id', 'nom'] },
      { model: Fournisseur, attributes: ['id', 'nom'] },
      { model: AchatCommande, attributes: ['id', 'reference'] },
    ],
    order: [['date_emission', 'DESC']],
  });
  return ok(res, factures);
}

async function showFacture(req, res) {
  const facture = await Facture.findByPk(req.params.id, {
    include: [
      { model: Chantier, attributes: ['id', 'nom'] },
      { model: Fournisseur, attributes: ['id', 'nom', 'email', 'contact'] },
    ],
  });
  if (!facture) return notFound(res, 'Facture introuvable');
  return ok(res, facture);
}

async function createFacture(req, res) {
  const { chantier_id, fournisseur_id, commande_id, numero, montant_ht, taux_tva, date_emission, date_echeance } = req.body;
  if (!chantier_id || !fournisseur_id || !montant_ht || !date_emission) {
    return badRequest(res, 'Champs obligatoires manquants');
  }

  const tva = parseFloat(taux_tva ?? 19.25);
  const ht = parseFloat(montant_ht);
  const tvaAmount = ht * (tva / 100);

  const facture = await Facture.create({
    chantier_id, fournisseur_id,
    commande_id: commande_id || null,
    numero: numero || `FAC-${Date.now()}`,
    montant_ht: ht,
    taux_tva: tva,
    montant_tva: tvaAmount,
    montant_ttc: ht + tvaAmount,
    montant_encaisse: 0,
    date_emission, date_echeance,
    status: 'en_attente',
    createur_id: req.user.id,
  });
  return created(res, facture, 'Facture créée');
}

async function payerFacture(req, res) {
  const facture = await Facture.findByPk(req.params.id);
  if (!facture) return notFound(res, 'Facture introuvable');

  const montant = parseFloat(req.body.montant || facture.montant_ttc);
  const nouveauEncaisse = parseFloat(facture.montant_encaisse) + montant;
  const status = nouveauEncaisse >= parseFloat(facture.montant_ttc) ? 'payee' : 'partiellement_payee';

  await facture.update({
    montant_encaisse: nouveauEncaisse,
    status,
    date_paiement: status === 'payee' ? new Date() : facture.date_paiement,
  });
  return ok(res, facture, 'Paiement enregistré');
}

// ─── Tableau de bord financier (DG + DAF) ─────────────────────────────────

async function dashboard(req, res) {
  const { Sequelize } = require('../models');
  const { fn, col, literal } = Sequelize;

  const [chantiers, depensesParCategorie, facturesStats] = await Promise.all([
    Chantier.findAll({
      attributes: ['id', 'nom', 'budget', 'depenses', 'status'],
      order: [['nom', 'ASC']],
    }),
    Depense.findAll({
      attributes: [
        'categorie',
        [fn('SUM', col('montant')), 'total'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['categorie'],
    }),
    Facture.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('montant_ttc')), 'total_ttc'],
        [fn('SUM', col('montant_encaisse')), 'total_encaisse'],
      ],
      group: ['status'],
    }),
  ]);

  const budgetTotal = chantiers.reduce((s, c) => s + parseFloat(c.budget || 0), 0);
  const depensesTotal = chantiers.reduce((s, c) => s + parseFloat(c.depenses || 0), 0);

  return ok(res, {
    synthese: { budget_total: budgetTotal, depenses_total: depensesTotal, solde: budgetTotal - depensesTotal },
    chantiers,
    depenses_par_categorie: depensesParCategorie,
    factures_stats: facturesStats,
  });
}

module.exports = { listDepenses, createDepense, listFactures, showFacture, createFacture, payerFacture, dashboard };
