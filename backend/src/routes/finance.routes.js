const router = require('express').Router();
const {
  listDepenses, createDepense,
  listFactures, showFacture, createFacture, payerFacture,
  dashboard,
} = require('../controllers/finance.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.get('/dashboard',       authenticate, allow('view_finance_full'), dashboard);

router.get('/depenses',        authenticate, allow('view_finance_full', 'view_finance_partial'), listDepenses);
router.post('/depenses',       authenticate, allow('manage_finance'), createDepense);

router.get('/factures',        authenticate, allow('view_finance_full', 'view_finance_partial'), listFactures);
router.get('/factures/:id',    authenticate, allow('view_finance_full', 'view_finance_partial'), showFacture);
router.post('/factures',       authenticate, allow('manage_finance'), createFacture);
router.patch('/factures/:id/payer', authenticate, allow('manage_finance'), payerFacture);

module.exports = router;
