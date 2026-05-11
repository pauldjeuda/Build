import api from './api';

export const rapportsService = {
  list:     (params) => api.get('/rapports', { params }),
  show:     (id)     => api.get(`/rapports/${id}`),
  create:   (data)   => api.post('/rapports', data),
  update:   (id, data) => api.patch(`/rapports/${id}`, data),
  submit:   (id)     => api.patch(`/rapports/${id}/submit`),
  validate: (id)     => api.patch(`/rapports/${id}/validate`),
  reject:   (id, motif) => api.patch(`/rapports/${id}/reject`, { motif }),
};
