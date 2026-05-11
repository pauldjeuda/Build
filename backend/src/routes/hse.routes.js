const router = require('express').Router();
const {
  listIncidents, showIncident, declareIncident, prendreEnCharge, cloturerIncident,
  addActionCorrective, updateActionCorrective,
  listInspections, createInspection,
  kpis,
} = require('../controllers/hse.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.get('/kpis', authenticate, allow('view_incidents', 'manage_incident'), kpis);

// Incidents
router.get('/incidents',                          authenticate, allow('view_incidents'), listIncidents);
router.get('/incidents/:id',                      authenticate, allow('view_incidents'), showIncident);
router.post('/incidents',                         authenticate, allow('declare_incident'), declareIncident);
router.patch('/incidents/:id/prendre-en-charge',  authenticate, allow('manage_incident'), prendreEnCharge);
router.patch('/incidents/:id/cloturer',           authenticate, allow('manage_incident'), cloturerIncident);

// Actions correctives
router.post('/incidents/:id/actions',             authenticate, allow('manage_incident'), addActionCorrective);
router.patch('/incidents/:incidentId/actions/:actionId', authenticate, allow('manage_incident'), updateActionCorrective);

// Inspections
router.get('/inspections',   authenticate, allow('view_inspections'), listInspections);
router.post('/inspections',  authenticate, allow('manage_inspections'), createInspection);

module.exports = router;
