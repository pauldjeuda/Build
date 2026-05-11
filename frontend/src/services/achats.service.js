import api from './api';

export const achatsService = {
  // Demandes
  listDemandes:   (params) => api.get('/achats/demandes', { params }),
  createDemande:  (data)   => api.post('/achats/demandes', data),
  validateCdt:    (id)     => api.patch(`/achats/demandes/${id}/validate-cdt`),
  validateDaf:    (id)     => api.patch(`/achats/demandes/${id}/validate-daf`),
  receive:        (id)     => api.patch(`/achats/demandes/${id}/receive`),
  reject:         (id, motif) => api.patch(`/achats/demandes/${id}/reject`, { motif }),

  // Commandes
  listCommandes:  (params) => api.get('/achats/commandes', { params }),
  createCommande: (data)   => api.post('/achats/commandes', data),

  // Fournisseurs
  listFournisseurs:   ()     => api.get('/achats/fournisseurs'),
  createFournisseur:  (data) => api.post('/achats/fournisseurs', data),
};
