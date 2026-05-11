const router = require('express').Router();
const {
  listIncidents, showIncident, declareIncident, prendreEnCharge, cloturerIncident,
  addActionCorrective, updateActionCorrective,
  listInspections, createInspection,
  kpis,
} = require('../controllers/hse.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

router.get('/kpis', authenticate, allow('view_incidents', 'manage_incident'), catchAsync(kpis));

// Incidents
router.get('/incidents',                         authenticate, allow('view_incidents'),   catchAsync(listIncidents));
router.get('/incidents/:id',                     authenticate, allow('view_incidents'),   catchAsync(showIncident));
router.post('/incidents',                        authenticate, allow('declare_incident'), catchAsync(declareIncident));
router.patch('/incidents/:id/prendre-en-charge', authenticate, allow('manage_incident'), catchAsync(prendreEnCharge));
router.patch('/incidents/:id/cloturer',          authenticate, allow('manage_incident'), catchAsync(cloturerIncident));

// Actions correctives
router.post('/incidents/:id/actions',                        authenticate, allow('manage_incident'), catchAsync(addActionCorrective));
router.patch('/incidents/:incidentId/actions/:actionId',     authenticate, allow('manage_incident'), catchAsync(updateActionCorrective));

// Inspections
router.get('/inspections',  authenticate, allow('view_inspections'),   catchAsync(listInspections));
router.post('/inspections', authenticate, allow('manage_inspections'), catchAsync(createInspection));

module.exports = router;
