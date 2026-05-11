import api from './api';

export const hseService = {
  kpis: () => api.get('/hse/kpis'),

  // Incidents
  listIncidents:      (params) => api.get('/hse/incidents', { params }),
  showIncident:       (id)     => api.get(`/hse/incidents/${id}`),
  declareIncident:    (data)   => api.post('/hse/incidents', data),
  prendreEnCharge:    (id, data) => api.patch(`/hse/incidents/${id}/prendre-en-charge`, data),
  cloturerIncident:   (id, data) => api.patch(`/hse/incidents/${id}/cloturer`, data),

  // Actions correctives
  addAction:    (incidentId, data)          => api.post(`/hse/incidents/${incidentId}/actions`, data),
  updateAction: (incidentId, actionId, data) => api.patch(`/hse/incidents/${incidentId}/actions/${actionId}`, data),

  // Inspections
  listInspections:  (params) => api.get('/hse/inspections', { params }),
  createInspection: (data)   => api.post('/hse/inspections', data),
};
