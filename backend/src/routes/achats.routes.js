const router = require('express').Router();
const {
  listDemandes, createDemande, validateCdt, validateDaf, receive, rejectDemande,
  listCommandes, createCommande,
  listFournisseurs, createFournisseur,
} = require('../controllers/achats.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

// Demandes
router.get('/demandes',                    authenticate, allow('view_achats'),       catchAsync(listDemandes));
router.post('/demandes',                   authenticate, allow('create_achat_demande'), catchAsync(createDemande));
router.patch('/demandes/:id/validate-cdt', authenticate, allow('validate_achat_cdt'),  catchAsync(validateCdt));
router.patch('/demandes/:id/validate-daf', authenticate, allow('validate_achat_daf'),  catchAsync(validateDaf));
router.patch('/demandes/:id/receive',      authenticate, allow('receive_achat'),        catchAsync(receive));
router.patch('/demandes/:id/reject',       authenticate, allow('validate_achat_cdt', 'validate_achat_daf'), catchAsync(rejectDemande));

// Commandes
router.get('/commandes',  authenticate, allow('view_commandes'), catchAsync(listCommandes));
router.post('/commandes', authenticate, allow('view_commandes'), catchAsync(createCommande));

// Fournisseurs
router.get('/fournisseurs',  authenticate, allow('view_fournisseurs'), catchAsync(listFournisseurs));
router.post('/fournisseurs', authenticate, allow('manage_finance'),    catchAsync(createFournisseur));

module.exports = router;
