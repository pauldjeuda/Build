const router = require('express').Router();
const {
  listArticles, showArticle, createArticle, updateArticle,
  listMouvements, createMouvement, listAlertes,
} = require('../controllers/stock.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.get('/alertes',             authenticate, allow('view_stock'), listAlertes);
router.get('/articles',            authenticate, allow('view_stock'), listArticles);
router.get('/articles/:id',        authenticate, allow('view_stock'), showArticle);
router.post('/articles',           authenticate, allow('manage_stock'), createArticle);
router.patch('/articles/:id',      authenticate, allow('manage_stock'), updateArticle);

router.get('/mouvements',          authenticate, allow('view_stock'), listMouvements);
router.post('/mouvements',         authenticate, allow('manage_stock', 'request_stock'), createMouvement);

module.exports = router;
