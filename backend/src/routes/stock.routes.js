const router = require('express').Router();
const {
  listArticles, showArticle, createArticle, updateArticle,
  listMouvements, createMouvement, listAlertes,
} = require('../controllers/stock.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

router.get('/alertes',        authenticate, allow('view_stock'),   catchAsync(listAlertes));
router.get('/articles',       authenticate, allow('view_stock'),   catchAsync(listArticles));
router.get('/articles/:id',   authenticate, allow('view_stock'),   catchAsync(showArticle));
router.post('/articles',      authenticate, allow('manage_stock'), catchAsync(createArticle));
router.patch('/articles/:id', authenticate, allow('manage_stock'), catchAsync(updateArticle));

router.get('/mouvements',     authenticate, allow('view_stock'),                     catchAsync(listMouvements));
router.post('/mouvements',    authenticate, allow('manage_stock', 'request_stock'),  catchAsync(createMouvement));

module.exports = router;
