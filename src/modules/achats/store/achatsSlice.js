import { createSlice } from '@reduxjs/toolkit';

const MOCK_DEMANDES = [
  { id: 1, reference: 'DA-2025-001', article: 'Ciment CEM II — 500 sacs', chantier: 'Immeuble Akwa', montant: 10000000, status: 'approuve', demandeur: 'Paul Ngono', date: '2025-05-07' },
  { id: 2, reference: 'DA-2025-002', article: 'Gravier 10/20 — 20m³', chantier: 'Route Yassa', montant: 400000, status: 'en_attente', demandeur: 'Jean Mbarga', date: '2025-05-08' },
  { id: 3, reference: 'DA-2025-003', article: 'Échafaudages', chantier: 'Pont Wouri', montant: 3500000, status: 'en_attente', demandeur: 'Marc Foning', date: '2025-05-09' },
];

const MOCK_FOURNISSEURS = [
  { id: 1, nom: 'CIM Cameroun', categorie: 'Matériaux', contact: '+237 222 001 001', ville: 'Douala', status: 'actif' },
  { id: 2, nom: 'SOCATRAF', categorie: 'Granulats', contact: '+237 233 002 002', ville: 'Yaoundé', status: 'actif' },
  { id: 3, nom: 'HYDROCAM', categorie: 'Équipements', contact: '+237 244 003 003', ville: 'Douala', status: 'actif' },
];

const MOCK_COMMANDES = [
  { id: 1, reference: 'BC-2025-001', fournisseur: 'CIM Cameroun', article: 'Ciment CEM II — 500 sacs', chantier: 'Immeuble Akwa', montant: 10000000, dateCommande: '2025-05-07', dateLivraison: '2025-05-14', status: 'en_cours', demandeRef: 'DA-2025-001' },
  { id: 2, reference: 'BC-2025-002', fournisseur: 'HYDROCAM', article: 'Échafaudages × 15', chantier: 'Pont Wouri', montant: 3500000, dateCommande: '2025-05-09', dateLivraison: '2025-05-16', status: 'en_cours', demandeRef: 'DA-2025-003' },
  { id: 3, reference: 'BC-2025-003', fournisseur: 'SOCATRAF', article: 'Gravier 10/20 — 30m³', chantier: 'Route Yassa', montant: 600000, dateCommande: '2025-04-28', dateLivraison: '2025-05-03', status: 'livre', demandeRef: null },
  { id: 4, reference: 'BC-2025-004', fournisseur: 'CIM Cameroun', article: 'Sable de rivière — 30m³', chantier: 'Pont Wouri', montant: 450000, dateCommande: '2025-04-15', dateLivraison: '2025-04-20', status: 'livre', demandeRef: null },
  { id: 5, reference: 'BC-2025-005', fournisseur: 'HYDROCAM', article: 'Vibreur à béton — 2 unités', chantier: 'École Mendong', montant: 280000, dateCommande: '2025-04-10', dateLivraison: '2025-04-12', status: 'annule', demandeRef: null },
];

const achatsSlice = createSlice({
  name: 'achats',
  initialState: {
    demandes: MOCK_DEMANDES,
    fournisseurs: MOCK_FOURNISSEURS,
    commandes: MOCK_COMMANDES,
    loading: false,
  },
  reducers: {
    addDemande(state, action) {
      const num = String(state.demandes.length + 1).padStart(3, '0');
      state.demandes.unshift({ ...action.payload, id: Date.now(), reference: `DA-2025-${num}` });
    },
    updateDemande(state, action) {
      const idx = state.demandes.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.demandes[idx] = action.payload;
    },
    addCommande(state, action) {
      const num = String(state.commandes.length + 1).padStart(3, '0');
      state.commandes.unshift({ ...action.payload, id: Date.now(), reference: `BC-2025-${num}`, status: 'en_cours' });
    },
    updateCommande(state, action) {
      const idx = state.commandes.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.commandes[idx] = { ...state.commandes[idx], ...action.payload };
    },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { addDemande, updateDemande, addCommande, updateCommande, setLoading } = achatsSlice.actions;
export default achatsSlice.reducer;
