const router = require('express').Router();
const {
  listEngins, showEngin, createEngin, updateEngin,
  listMaintenances, createMaintenance, clotureMaintenance,
  listCarnet, addCarnetEntry,
} = require('../controllers/engins.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.get('/',    authenticate, allow('view_engins'), listEngins);
router.get('/:id', authenticate, allow('view_engins'), showEngin);
router.post('/',   authenticate, allow('manage_engins'), createEngin);
router.patch('/:id', authenticate, allow('manage_engins'), updateEngin);

// Maintenance (LOG gère)
router.get('/:enginId/maintenances',       authenticate, allow('view_engins'), listMaintenances);
router.post('/:enginId/maintenances',      authenticate, allow('manage_engins'), createMaintenance);
router.patch('/maintenances/:id/cloturer', authenticate, allow('manage_engins'), clotureMaintenance);

// Carnet de bord (CDC saisit)
router.get('/:enginId/carnet',  authenticate, allow('view_engins'), listCarnet);
router.post('/:enginId/carnet', authenticate, allow('log_carnet_engin', 'manage_engins'), addCarnetEntry);

module.exports = router;
