const { Engin, EnginMaintenance, EnginCarnet, Chantier, User } = require('../models');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');

const INCLUDE_ENGIN = [
  { model: Chantier, as: 'chantierActuel', attributes: ['id', 'nom'] },
  { model: User,     as: 'responsable',    attributes: ['id', 'name'] },
];

// ─── Engins ───────────────────────────────────────────────────────────────

async function listEngins(req, res) {
  const where = {};
  if (req.query.status)     where.status     = req.query.status;
  if (req.query.chantier_id) where.chantier_id = req.query.chantier_id;
  if (req.query.type)       where.type        = req.query.type;

  const engins = await Engin.findAll({ where, include: INCLUDE_ENGIN, order: [['immatriculation', 'ASC']] });
  return ok(res, engins);
}

async function showEngin(req, res) {
  const engin = await Engin.findByPk(req.params.id, {
    include: [
      ...INCLUDE_ENGIN,
      { model: EnginMaintenance, as: 'maintenances', order: [['date_debut', 'DESC']], limit: 10 },
    ],
  });
  if (!engin) return notFound(res, 'Engin introuvable');
  return ok(res, engin);
}

async function createEngin(req, res) {
  const { immatriculation, type, marque, modele, annee, chantier_id, responsable_id, date_mise_en_service } = req.body;
  if (!immatriculation || !type) return badRequest(res, 'Immatriculation et type requis');

  const engin = await Engin.create({
    immatriculation, type, marque, modele,
    annee: annee ? parseInt(annee) : null,
    chantier_id:     chantier_id     || null,
    responsable_id:  responsable_id  || null,
    date_mise_en_service,
    status: 'disponible',
  });
  return created(res, engin, 'Engin créé');
}

async function updateEngin(req, res) {
  const engin = await Engin.findByPk(req.params.id);
  if (!engin) return notFound(res, 'Engin introuvable');
  await engin.update(req.body);
  return ok(res, engin, 'Engin mis à jour');
}

// ─── Maintenance ──────────────────────────────────────────────────────────

async function listMaintenances(req, res) {
  const where = {};
  if (req.params.enginId) where.engin_id = req.params.enginId;
  if (req.query.type)     where.type     = req.query.type;
  if (req.query.status)   where.status   = req.query.status;

  const maintenances = await EnginMaintenance.findAll({
    where,
    include: [{ model: Engin, attributes: ['id', 'immatriculation', 'type', 'marque'] }],
    order: [['date_debut', 'DESC']],
  });
  return ok(res, maintenances);
}

async function createMaintenance(req, res) {
  const engin = await Engin.findByPk(req.params.enginId);
  if (!engin) return notFound(res, 'Engin introuvable');

  const { type, description, date_debut, date_fin_prevue, cout, prestataire } = req.body;
  if (!type || !date_debut) return badRequest(res, 'Type et date de début requis');

  const maintenance = await EnginMaintenance.create({
    engin_id: req.params.enginId,
    type, description, date_debut, date_fin_prevue,
    cout: cout ? parseFloat(cout) : null,
    prestataire,
    status: 'planifie',
    createur_id: req.user.id,
  });

  await engin.update({ status: 'maintenance' });
  return created(res, maintenance, 'Maintenance planifiée');
}

async function clotureMaintenance(req, res) {
  const maintenance = await EnginMaintenance.findByPk(req.params.id, { include: [{ model: Engin }] });
  if (!maintenance) return notFound(res, 'Maintenance introuvable');
  if (maintenance.status === 'termine') return badRequest(res, 'Maintenance déjà clôturée');

  await maintenance.update({
    status: 'termine',
    date_fin_reelle: new Date(),
    cout_reel:    req.body.cout_reel ? parseFloat(req.body.cout_reel) : maintenance.cout,
    observations: req.body.observations,
  });

  if (maintenance.Engin) await maintenance.Engin.update({ status: 'operationnel' });
  return ok(res, maintenance, 'Maintenance clôturée');
}

// ─── Carnet de bord (CDC) ─────────────────────────────────────────────────

async function listCarnet(req, res) {
  const entries = await EnginCarnet.findAll({
    where: { engin_id: req.params.enginId },
    include: [{ model: User, as: 'auteur', attributes: ['id', 'name'] }],
    order: [['date', 'DESC']],
  });
  return ok(res, entries);
}

async function addCarnetEntry(req, res) {
  const engin = await Engin.findByPk(req.params.enginId);
  if (!engin) return notFound(res, 'Engin introuvable');

  const { date, heures_travail, km_parcourus, carburant_consomme, observations, anomalies } = req.body;
  if (!date) return badRequest(res, 'Date requise');

  const entry = await EnginCarnet.create({
    engin_id: req.params.enginId,
    date, heures_travail, km_parcourus,
    carburant_consomme: carburant_consomme ? parseFloat(carburant_consomme) : null,
    observations, anomalies,
    auteur_id: req.user.id,
  });
  return created(res, entry, 'Entrée carnet ajoutée');
}

module.exports = {
  listEngins, showEngin, createEngin, updateEngin,
  listMaintenances, createMaintenance, clotureMaintenance,
  listCarnet, addCarnetEntry,
};
