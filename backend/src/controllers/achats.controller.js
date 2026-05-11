const { AchatDemande, AchatCommande, Fournisseur, Chantier, User } = require('../models');
const { ok, created, notFound, badRequest, forbidden } = require('../utils/apiResponse');
const { events } = require('../services/notification.service');

const INCLUDE_DEMANDE = [
  { model: Chantier, attributes: ['id', 'nom'] },
  { model: User, as: 'demandeur',      attributes: ['id', 'name'] },
  { model: User, as: 'validateurCdt',  attributes: ['id', 'name'] },
  { model: User, as: 'validateurDaf',  attributes: ['id', 'name'] },
  { model: User, as: 'receptionnaire', attributes: ['id', 'name'] },
];

// ─── Demandes ─────────────────────────────────────────────────────────────

// GET /api/achats/demandes — §23 workflow
async function listDemandes(req, res) {
  const { role, id } = req.user;
  // CDC voit ses propres demandes seulement
  const where = role === 'cdc' ? { demandeur_id: id } : {};
  if (req.query.status) where.status = req.query.status;

  const demandes = await AchatDemande.findAll({ where, include: INCLUDE_DEMANDE, order: [['created_at', 'DESC']] });
  return ok(res, demandes);
}

// POST /api/achats/demandes — CDC uniquement (§23)
async function createDemande(req, res) {
  const { chantier_id, article, montant, justification } = req.body;
  if (!chantier_id || !article || !montant) return badRequest(res, 'Champs obligatoires manquants');

  const demande = await AchatDemande.create({
    chantier_id, article,
    montant: parseFloat(montant),
    justification,
    demandeur_id: req.user.id,
    status: 'en_attente',
  });
  await events.achatCreee(demande);
  return created(res, demande, 'Demande créée — en attente validation CDT');
}

// PATCH /api/achats/demandes/:id/validate-cdt — CDT valide le besoin (étape 1)
async function validateCdt(req, res) {
  const demande = await AchatDemande.findByPk(req.params.id);
  if (!demande) return notFound(res, 'Demande introuvable');
  if (demande.status !== 'en_attente') return badRequest(res, 'Cette demande ne peut plus être validée à cette étape');

  await demande.update({
    status: 'valide_cdt',
    validateur_cdt_id: req.user.id,
    valide_cdt_at: new Date(),
  });
  await events.achatValideCdt(demande);
  return ok(res, demande, 'Besoin validé — en attente approbation budget DAF');
}

// PATCH /api/achats/demandes/:id/validate-daf — DAF approuve le budget (étape 2)
async function validateDaf(req, res) {
  const demande = await AchatDemande.findByPk(req.params.id);
  if (!demande) return notFound(res, 'Demande introuvable');
  if (demande.status !== 'valide_cdt') return badRequest(res, 'Cette demande doit être validée par le CDT d\'abord');

  await demande.update({
    status: 'approuve',
    validateur_daf_id: req.user.id,
    approuve_at: new Date(),
  });
  await events.achatApprouveDAF(demande);
  return ok(res, demande, 'Budget approuvé');
}

// PATCH /api/achats/demandes/:id/receive — GST réceptionne (étape 3)
async function receive(req, res) {
  const demande = await AchatDemande.findByPk(req.params.id);
  if (!demande) return notFound(res, 'Demande introuvable');
  if (demande.status !== 'approuve') return badRequest(res, 'La demande doit être approuvée avant réception');

  await demande.update({
    status: 'livre',
    receptionnaire_id: req.user.id,
    livre_at: new Date(),
  });
  return ok(res, demande, 'Livraison réceptionnée');
}

// PATCH /api/achats/demandes/:id/reject — CDT ou DAF rejette
async function rejectDemande(req, res) {
  const demande = await AchatDemande.findByPk(req.params.id);
  if (!demande) return notFound(res, 'Demande introuvable');
  if (!['en_attente', 'valide_cdt'].includes(demande.status)) {
    return badRequest(res, 'Cette demande ne peut plus être rejetée');
  }
  await demande.update({
    status: 'rejete',
    motif_rejet: req.body.motif || null,
    rejete_at: new Date(),
  });
  return ok(res, demande, 'Demande rejetée');
}

// ─── Commandes ────────────────────────────────────────────────────────────

async function listCommandes(req, res) {
  const commandes = await AchatCommande.findAll({
    include: [
      { model: AchatDemande, attributes: ['id', 'reference'] },
      { model: Fournisseur,  attributes: ['id', 'nom', 'categorie'] },
      { model: Chantier,     attributes: ['id', 'nom'] },
    ],
    order: [['created_at', 'DESC']],
  });
  return ok(res, commandes);
}

async function createCommande(req, res) {
  const { demande_id, fournisseur_id, chantier_id, article, montant, date_commande, date_livraison_prevue } = req.body;
  const commande = await AchatCommande.create({
    demande_id, fournisseur_id, chantier_id, article,
    montant: parseFloat(montant),
    date_commande,
    date_livraison_prevue,
    createur_id: req.user.id,
  });
  return created(res, commande, 'Commande créée');
}

// ─── Fournisseurs ─────────────────────────────────────────────────────────

async function listFournisseurs(req, res) {
  const fournisseurs = await Fournisseur.findAll({ order: [['nom', 'ASC']] });
  return ok(res, fournisseurs);
}

async function createFournisseur(req, res) {
  const { nom, categorie, contact, email, ville, adresse } = req.body;
  if (!nom) return badRequest(res, 'Nom requis');
  const f = await Fournisseur.create({ nom, categorie, contact, email, ville, adresse });
  return created(res, f, 'Fournisseur créé');
}

module.exports = {
  listDemandes, createDemande, validateCdt, validateDaf, receive, rejectDemande,
  listCommandes, createCommande,
  listFournisseurs, createFournisseur,
};
