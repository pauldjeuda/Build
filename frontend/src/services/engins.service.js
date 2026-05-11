import api from './api';

export const enginsService = {
  list:   (params) => api.get('/engins', { params }),
  show:   (id)     => api.get(`/engins/${id}`),
  create: (data)   => api.post('/engins', data),
  update: (id, data) => api.patch(`/engins/${id}`, data),

  // Maintenance
  listMaintenances:   (enginId)       => api.get(`/engins/${enginId}/maintenances`),
  createMaintenance:  (enginId, data) => api.post(`/engins/${enginId}/maintenances`, data),
  clotureMaintenance: (id, data)      => api.patch(`/engins/maintenances/${id}/cloturer`, data),

  // Carnet de bord
  listCarnet:     (enginId)       => api.get(`/engins/${enginId}/carnet`),
  addCarnetEntry: (enginId, data) => api.post(`/engins/${enginId}/carnet`, data),
};
