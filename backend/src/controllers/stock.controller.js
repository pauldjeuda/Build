const { Op } = require('sequelize');
const { StockArticle, StockMouvement, Chantier, User } = require('../models');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');
const { events } = require('../services/notification.service');

const SEUIL_ALERTE_DEFAULT = 10;

// ─── Articles ─────────────────────────────────────────────────────────────

async function listArticles(req, res) {
  const where = {};
  if (req.query.categorie) where.categorie = req.query.categorie;
  if (req.query.search) where.designation = { [Op.like]: `%${req.query.search}%` };

  const articles = await StockArticle.findAll({ where, order: [['designation', 'ASC']] });
  return ok(res, articles);
}

async function showArticle(req, res) {
  const article = await StockArticle.findByPk(req.params.id);
  if (!article) return notFound(res, 'Article introuvable');
  return ok(res, article);
}

async function createArticle(req, res) {
  const { designation, reference, categorie, unite, stock, stock_min, prix_unitaire, localisation } = req.body;
  if (!designation || !unite) return badRequest(res, 'Désignation et unité requis');

  const article = await StockArticle.create({
    designation, reference, categorie, unite,
    stock: parseFloat(stock || 0),
    stock_min: parseFloat(stock_min ?? SEUIL_ALERTE_DEFAULT),
    prix_unitaire: parseFloat(prix_unitaire || 0),
    localisation,
  });
  return created(res, article, 'Article créé');
}

async function updateArticle(req, res) {
  const article = await StockArticle.findByPk(req.params.id);
  if (!article) return notFound(res, 'Article introuvable');
  await article.update(req.body);
  return ok(res, article, 'Article mis à jour');
}

// ─── Mouvements ───────────────────────────────────────────────────────────

async function listMouvements(req, res) {
  const where = {};
  if (req.query.article_id) where.article_id = req.query.article_id;

  const mouvements = await StockMouvement.findAll({
    where,
    include: [
      { model: StockArticle, attributes: ['id', 'designation', 'unite'] },
      { model: User, as: 'createur', attributes: ['id', 'name'] },
      { model: Chantier, as: 'chantierSource', attributes: ['id', 'nom'] },
      { model: Chantier, as: 'chantierDest', attributes: ['id', 'nom'] },
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(req.query.limit || 100),
  });
  return ok(res, mouvements);
}

async function createMouvement(req, res) {
  const { article_id, type, quantite, chantier_source_id, chantier_dest_id, motif } = req.body;
  if (!article_id || !type || !quantite) return badRequest(res, 'Champs obligatoires manquants');

  const article = await StockArticle.findByPk(article_id);
  if (!article) return notFound(res, 'Article introuvable');

  const qty = parseFloat(quantite);
  if (qty <= 0) return badRequest(res, 'La quantité doit être positive');

  // Vérifier le stock disponible pour les sorties et transferts
  if (['sortie', 'transfert'].includes(type) && article.stock < qty) {
    return badRequest(res, `Stock insuffisant — disponible : ${article.stock} ${article.unite}`);
  }

  // Calculer le nouveau stock
  let delta = 0;
  if (type === 'entree') delta = qty;
  else if (type === 'sortie') delta = -qty;
  // transfert : stock global inchangé (source → dest sur même entrepôt)

  const mouvement = await StockMouvement.create({
    article_id, type, quantite: qty,
    chantier_id:             chantier_source_id || null,
    chantier_destination_id: chantier_dest_id   || null,
    motif,
    createur_id: req.user.id,
    stock_avant: article.stock,
    stock_apres: article.stock + delta,
  });

  await article.update({ stock: article.stock + delta });

  // Alerte stock faible
  const updatedArticle = await StockArticle.findByPk(article_id);
  if (updatedArticle.stock <= updatedArticle.stock_min) {
    await events.stockAlerte(updatedArticle);
  }

  return created(res, mouvement, 'Mouvement enregistré');
}

// ─── Alertes ──────────────────────────────────────────────────────────────

async function listAlertes(req, res) {
  const { Sequelize } = require('../models');
  const articles = await StockArticle.findAll({
    where: Sequelize.literal('stock <= stock_min'),
    order: [['stock', 'ASC']],
  });
  return ok(res, articles);
}

module.exports = { listArticles, showArticle, createArticle, updateArticle, listMouvements, createMouvement, listAlertes };
