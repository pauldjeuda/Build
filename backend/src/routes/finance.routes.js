const router = require('express').Router();
const {
  listDepenses, createDepense,
  listFactures, showFacture, createFacture, payerFacture,
  dashboard,
} = require('../controllers/finance.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

router.get('/dashboard',          authenticate, allow('view_finance_full'), catchAsync(dashboard));

router.get('/depenses',           authenticate, allow('view_finance_full', 'view_finance_partial'), catchAsync(listDepenses));
router.post('/depenses',          authenticate, allow('manage_finance'),    catchAsync(createDepense));

router.get('/factures',           authenticate, allow('view_finance_full', 'view_finance_partial'), catchAsync(listFactures));
router.get('/factures/:id',       authenticate, allow('view_finance_full', 'view_finance_partial'), catchAsync(showFacture));
router.post('/factures',          authenticate, allow('manage_finance'),    catchAsync(createFacture));
router.patch('/factures/:id/payer', authenticate, allow('manage_finance'), catchAsync(payerFacture));

module.exports = router;
