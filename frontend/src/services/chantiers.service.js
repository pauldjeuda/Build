import api from './api';

export const chantiersService = {
  list:   (params) => api.get('/chantiers', { params }),
  show:   (id)     => api.get(`/chantiers/${id}`),
  create: (data)   => api.post('/chantiers', data),
  update: (id, data) => api.patch(`/chantiers/${id}`, data),
};
