import api from './api';

export const stockService = {
  // Articles
  listArticles:   (params)     => api.get('/stock/articles', { params }),
  showArticle:    (id)         => api.get(`/stock/articles/${id}`),
  createArticle:  (data)       => api.post('/stock/articles', data),
  updateArticle:  (id, data)   => api.patch(`/stock/articles/${id}`, data),

  // Mouvements
  listMouvements: (params)     => api.get('/stock/mouvements', { params }),
  createMouvement: (data)      => api.post('/stock/mouvements', data),

  // Alertes
  listAlertes:    ()           => api.get('/stock/alertes'),
};
