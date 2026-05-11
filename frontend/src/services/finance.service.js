import api from './api';

export const financeService = {
  dashboard: ()        => api.get('/finance/dashboard'),

  listDepenses:   (params) => api.get('/finance/depenses', { params }),
  createDepense:  (data)   => api.post('/finance/depenses', data),

  listFactures:   (params) => api.get('/finance/factures', { params }),
  showFacture:    (id)     => api.get(`/finance/factures/${id}`),
  createFacture:  (data)   => api.post('/finance/factures', data),
  payerFacture:   (id, montant) => api.patch(`/finance/factures/${id}/payer`, { montant }),
};
