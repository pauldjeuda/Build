const { Rapport, Chantier, User } = require('../models');
const { ok, created, notFound, badRequest, forbidden } = require('../utils/apiResponse');
const { events } = require('../services/notification.service');

const INCLUDE = [
  { model: Chantier, attributes: ['id', 'nom'] },
  { model: User, as: 'auteur',     attributes: ['id', 'name'] },
  { model: User, as: 'validateur', attributes: ['id', 'name'] },
];

// GET /api/rapports
// §22 : CDC voit ses rapports, CDT/DG voient tout
async function list(req, res) {
  const { role, id } = req.user;
  const where = role === 'cdc' ? { auteur_id: id } : {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.chantier_id) where.chantier_id = req.query.chantier_id;

  const rapports = await Rapport.findAll({ where, include: INCLUDE, order: [['date', 'DESC']] });
  return ok(res, rapports);
}

// GET /api/rapports/:id
async function show(req, res) {
  const rapport = await Rapport.findByPk(req.params.id, { include: INCLUDE });
  if (!rapport) return notFound(res, 'Rapport introuvable');
  return ok(res, rapport);
}

// POST /api/rapports — CDC crée (§22)
async function create(req, res) {
  const { chantier_id, date, meteo, effectif, travaux, quantites, observations, nb_incidents } = req.body;
  if (!chantier_id || !date || !meteo || !effectif || !travaux) {
    return badRequest(res, 'Champs obligatoires manquants');
  }
  const rapport = await Rapport.create({
    chantier_id, date, meteo,
    effectif: parseInt(effectif, 10),
    travaux, quantites, observations,
    nb_incidents: parseInt(nb_incidents || 0, 10),
    auteur_id: req.user.id,
    status: 'brouillon',
  });
  return created(res, rapport, 'Rapport créé');
}

// PATCH /api/rapports/:id/submit — CDC soumet
async function submit(req, res) {
  const rapport = await Rapport.findByPk(req.params.id, {
    include: [{ model: Chantier, attributes: ['nom'] }],
  });
  if (!rapport) return notFound(res, 'Rapport introuvable');
  if (rapport.auteur_id !== req.user.id) return forbidden(res);
  if (rapport.status !== 'brouillon') return badRequest(res, 'Seul un brouillon peut être soumis');

  await rapport.update({ status: 'soumis' });

  // §34 — Notifier CDT
  await events.rapportSoumis({ ...rapport.toJSON(), chantierNom: rapport.Chantier?.nom });

  return ok(res, rapport, 'Rapport soumis');
}

// PATCH /api/rapports/:id/validate — CDT valide (§22)
async function validate(req, res) {
  const rapport = await Rapport.findByPk(req.params.id);
  if (!rapport) return notFound(res, 'Rapport introuvable');
  if (rapport.status !== 'soumis') return badRequest(res, 'Seul un rapport soumis peut être validé');

  await rapport.update({ status: 'valide', validateur_id: req.user.id, valide_at: new Date() });
  await events.rapportValide(rapport, rapport.auteur_id);

  return ok(res, rapport, 'Rapport validé');
}

// PATCH /api/rapports/:id/reject — CDT rejette (§22)
async function reject(req, res) {
  const rapport = await Rapport.findByPk(req.params.id);
  if (!rapport) return notFound(res, 'Rapport introuvable');
  if (rapport.status !== 'soumis') return badRequest(res, 'Seul un rapport soumis peut être rejeté');

  await rapport.update({
    status: 'rejete',
    validateur_id: req.user.id,
    rejete_at: new Date(),
    motif_rejet: req.body.motif || null,
  });
  await events.rapportRejete(rapport, rapport.auteur_id);

  return ok(res, rapport, 'Rapport rejeté');
}

// PATCH /api/rapports/:id — CDC modifie son brouillon
async function update(req, res) {
  const rapport = await Rapport.findByPk(req.params.id);
  if (!rapport) return notFound(res, 'Rapport introuvable');
  if (rapport.auteur_id !== req.user.id) return forbidden(res);
  if (!['brouillon', 'rejete'].includes(rapport.status)) {
    return badRequest(res, 'Seul un brouillon ou rapport rejeté peut être modifié');
  }
  await rapport.update({ ...req.body, status: 'brouillon' });
  return ok(res, rapport);
}

module.exports = { list, show, create, submit, validate, reject, update };
