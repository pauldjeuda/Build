const router = require('express').Router();
const {
  listDemandes, createDemande, validateCdt, validateDaf, receive, rejectDemande,
  listCommandes, createCommande,
  listFournisseurs, createFournisseur,
} = require('../controllers/achats.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

// Demandes
router.get('/demandes',                    authenticate, allow('view_achats'), listDemandes);
router.post('/demandes',                   authenticate, allow('create_achat_demande'), createDemande);
router.patch('/demandes/:id/validate-cdt', authenticate, allow('validate_achat_cdt'), validateCdt);
router.patch('/demandes/:id/validate-daf', authenticate, allow('validate_achat_daf'), validateDaf);
router.patch('/demandes/:id/receive',      authenticate, allow('receive_achat'), receive);
router.patch('/demandes/:id/reject',       authenticate, allow('validate_achat_cdt', 'validate_achat_daf'), rejectDemande);

// Commandes
router.get('/commandes',  authenticate, allow('view_commandes'), listCommandes);
router.post('/commandes', authenticate, allow('view_commandes'), createCommande);

// Fournisseurs
router.get('/fournisseurs',  authenticate, allow('view_fournisseurs'), listFournisseurs);
router.post('/fournisseurs', authenticate, allow('manage_finance'), createFournisseur);

module.exports = router;
