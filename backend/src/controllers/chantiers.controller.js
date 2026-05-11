const { Op } = require('sequelize');
const { Chantier, User } = require('../models');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');
const { can } = require('../middleware/rbac');

const INCLUDE_USERS = [
  { model: User, as: 'chef',       attributes: ['id', 'name', 'role'] },
  { model: User, as: 'conducteur', attributes: ['id', 'name', 'role'] },
];

// GET /api/chantiers — §42 : DG/DAF/HSE voient tout, autres voient les leurs
async function list(req, res) {
  const { role, id: userId } = req.user;
  let where = {};

  if (!can(role, 'view_all_chantiers')) {
    // CDT voit les chantiers dont il est conducteur
    // CDC voit le chantier dont il est chef
    // GST/LOG voient tous les chantiers (partiellement — pas les finances)
    if (role === 'cdt') where = { conducteur_id: userId };
    else if (role === 'cdc') where = { chef_id: userId };
    // gst et log voient tout (partiel = pas de colonnes financières filtrées ici)
  }

  const { status, search } = req.query;
  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { nom: { [Op.like]: `%${search}%` } },
      { localisation: { [Op.like]: `%${search}%` } },
    ];
  }

  const chantiers = await Chantier.findAll({ where, include: INCLUDE_USERS, order: [['created_at', 'DESC']] });

  // §42 : masquer les données financières pour GST, LOG, HSE, CDC
  const shouldHideFinance = ['gst', 'log', 'hse', 'cdc'].includes(role);
  const data = shouldHideFinance
    ? chantiers.map((c) => {
        const plain = c.toJSON();
        delete plain.budget;
        delete plain.depenses;
        return plain;
      })
    : chantiers;

  return ok(res, data);
}

// GET /api/chantiers/:id
async function show(req, res) {
  const chantier = await Chantier.findByPk(req.params.id, { include: INCLUDE_USERS });
  if (!chantier) return notFound(res, 'Chantier introuvable');
  return ok(res, chantier);
}

// POST /api/chantiers — DG et CDT uniquement (§42)
async function create(req, res) {
  const { nom, description, localisation, budget, date_debut, date_fin, chef_id, conducteur_id } = req.body;
  if (!nom || !localisation || !date_debut || !date_fin) {
    return badRequest(res, 'Champs obligatoires manquants');
  }
  const chantier = await Chantier.create({
    nom, description, localisation, budget, date_debut, date_fin,
    chef_id, conducteur_id,
    status: 'brouillon',
  });
  return created(res, chantier, 'Chantier créé');
}

// PATCH /api/chantiers/:id — DG et CDT uniquement
async function update(req, res) {
  const chantier = await Chantier.findByPk(req.params.id);
  if (!chantier) return notFound(res, 'Chantier introuvable');
  await chantier.update(req.body);
  return ok(res, chantier, 'Chantier mis à jour');
}

module.exports = { list, show, create, update };
