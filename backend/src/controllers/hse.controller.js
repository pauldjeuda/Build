const { Incident, ActionCorrective, Inspection, Chantier, User } = require('../models');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');
const { events } = require('../services/notification.service');

const INCLUDE_INCIDENT = [
  { model: Chantier,        attributes: ['id', 'nom'] },
  { model: User, as: 'declarePar',  attributes: ['id', 'name'] },
  { model: User, as: 'gerePar',     attributes: ['id', 'name'] },
  { model: ActionCorrective, as: 'actions', include: [{ model: User, as: 'responsable', attributes: ['id', 'name'] }] },
];

// ─── Incidents ────────────────────────────────────────────────────────────

async function listIncidents(req, res) {
  const { role, id } = req.user;
  const where = {};

  // CDC voit seulement ses incidents déclarés
  if (role === 'cdc') where.declare_par_id = id;
  if (req.query.status) where.status = req.query.status;
  if (req.query.gravite) where.gravite = req.query.gravite;
  if (req.query.chantier_id) where.chantier_id = req.query.chantier_id;

  const incidents = await Incident.findAll({
    where,
    include: INCLUDE_INCIDENT,
    order: [['date_incident', 'DESC']],
  });
  return ok(res, incidents);
}

async function showIncident(req, res) {
  const incident = await Incident.findByPk(req.params.id, { include: INCLUDE_INCIDENT });
  if (!incident) return notFound(res, 'Incident introuvable');
  return ok(res, incident);
}

// POST /api/hse/incidents — CDC déclare (§24)
async function declareIncident(req, res) {
  const { chantier_id, date_incident, heure_incident, type, gravite, lieu, description, victimes, temoins } = req.body;
  if (!chantier_id || !date_incident || !type || !gravite || !description) {
    return badRequest(res, 'Champs obligatoires manquants');
  }

  const chantier = await Chantier.findByPk(chantier_id, { attributes: ['nom'] });

  const incident = await Incident.create({
    chantier_id, date_incident, heure_incident, type, gravite, lieu, description,
    victimes: victimes || null,
    temoins: temoins || null,
    declare_par_id: req.user.id,
    status: 'ouvert',
  });

  await events.incidentDeclare({
    ...incident.toJSON(),
    chantierNom: chantier?.nom || '',
  });

  return created(res, incident, 'Incident déclaré');
}

// PATCH /api/hse/incidents/:id/prendre-en-charge — HSE prend en charge
async function prendreEnCharge(req, res) {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return notFound(res, 'Incident introuvable');
  if (incident.status !== 'ouvert') return badRequest(res, 'Incident déjà pris en charge');

  await incident.update({
    status: 'en_cours',
    gere_par_id: req.user.id,
    prise_en_charge_at: new Date(),
    mesures_immediates: req.body.mesures_immediates,
  });
  return ok(res, incident, 'Incident pris en charge');
}

// PATCH /api/hse/incidents/:id/cloturer — HSE clôture
async function cloturerIncident(req, res) {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return notFound(res, 'Incident introuvable');
  if (!['en_cours', 'ouvert'].includes(incident.status)) {
    return badRequest(res, 'Incident déjà clôturé');
  }

  await incident.update({
    status: 'cloture',
    cloture_at: new Date(),
    rapport_final: req.body.rapport_final,
    cause_racine: req.body.cause_racine,
  });
  return ok(res, incident, 'Incident clôturé');
}

// ─── Actions correctives ───────────────────────────────────────────────────

async function addActionCorrective(req, res) {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return notFound(res, 'Incident introuvable');

  const { description, responsable_id, echeance, priorite } = req.body;
  if (!description || !echeance) return badRequest(res, 'Description et échéance requises');

  const action = await ActionCorrective.create({
    incident_id: req.params.id,
    description,
    responsable_id: responsable_id || null,
    echeance, priorite,
    status: 'en_attente',
    createur_id: req.user.id,
  });
  return created(res, action, 'Action corrective créée');
}

async function updateActionCorrective(req, res) {
  const action = await ActionCorrective.findByPk(req.params.actionId);
  if (!action) return notFound(res, 'Action introuvable');
  await action.update(req.body);
  return ok(res, action, 'Action mise à jour');
}

// ─── Inspections ──────────────────────────────────────────────────────────

async function listInspections(req, res) {
  const where = {};
  if (req.query.chantier_id) where.chantier_id = req.query.chantier_id;
  if (req.query.status) where.status = req.query.status;

  const inspections = await Inspection.findAll({
    where,
    include: [
      { model: Chantier, attributes: ['id', 'nom'] },
      { model: User, as: 'inspecteur', attributes: ['id', 'name'] },
    ],
    order: [['date_inspection', 'DESC']],
  });
  return ok(res, inspections);
}

async function createInspection(req, res) {
  const { chantier_id, date_inspection, type, observations, points_conformes, points_non_conformes } = req.body;
  if (!chantier_id || !date_inspection || !type) return badRequest(res, 'Champs obligatoires manquants');

  const inspection = await Inspection.create({
    chantier_id, date_inspection, type, observations,
    points_conformes: points_conformes || [],
    points_non_conformes: points_non_conformes || [],
    inspecteur_id: req.user.id,
    status: 'realise',
  });
  return created(res, inspection, 'Inspection enregistrée');
}

// ─── KPIs HSE ─────────────────────────────────────────────────────────────

async function kpis(req, res) {
  const { Sequelize } = require('../models');
  const { fn, col } = Sequelize;

  const [totalIncidents, parGravite, parStatus, totalInspections] = await Promise.all([
    Incident.count(),
    Incident.findAll({
      attributes: ['gravite', [fn('COUNT', col('id')), 'count']],
      group: ['gravite'],
    }),
    Incident.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
    }),
    Inspection.count(),
  ]);

  return ok(res, {
    total_incidents: totalIncidents,
    total_inspections: totalInspections,
    par_gravite: parGravite,
    par_status: parStatus,
  });
}

module.exports = {
  listIncidents, showIncident, declareIncident, prendreEnCharge, cloturerIncident,
  addActionCorrective, updateActionCorrective,
  listInspections, createInspection,
  kpis,
};
