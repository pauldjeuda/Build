const router = require('express').Router();
const {
  listEngins, showEngin, createEngin, updateEngin,
  listMaintenances, createMaintenance, clotureMaintenance,
  listCarnet, addCarnetEntry,
} = require('../controllers/engins.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

router.get('/',      authenticate, allow('view_engins'),   catchAsync(listEngins));
router.get('/:id',   authenticate, allow('view_engins'),   catchAsync(showEngin));
router.post('/',     authenticate, allow('manage_engins'), catchAsync(createEngin));
router.patch('/:id', authenticate, allow('manage_engins'), catchAsync(updateEngin));

// Maintenance — specific paths before /:id wildcard to avoid Express shadowing
router.patch('/maintenances/:id/cloturer', authenticate, allow('manage_engins'), catchAsync(clotureMaintenance));
router.get('/:enginId/maintenances',       authenticate, allow('view_engins'),   catchAsync(listMaintenances));
router.post('/:enginId/maintenances',      authenticate, allow('manage_engins'), catchAsync(createMaintenance));

// Carnet de bord
router.get('/:enginId/carnet',  authenticate, allow('view_engins'),                         catchAsync(listCarnet));
router.post('/:enginId/carnet', authenticate, allow('log_carnet_engin', 'manage_engins'),   catchAsync(addCarnetEntry));

module.exports = router;
