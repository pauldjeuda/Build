import { createSlice } from '@reduxjs/toolkit';

const MOCK = [
  { id: 1, reference: 'MAT-001', designation: 'Ciment CEM II', categorie: 'Matériaux', unite: 'sac 50kg', stock: 120, seuil: 200, chantier: 'Immeuble Akwa', valeur: 2400000 },
  { id: 2, reference: 'MAT-002', designation: 'Fer à béton HA12', categorie: 'Ferraillage', unite: 'tonne', stock: 8.5, seuil: 5, chantier: 'Route Yassa', valeur: 5950000 },
  { id: 3, reference: 'MAT-003', designation: 'Gravier 10/20', categorie: 'Granulats', unite: 'm³', stock: 45, seuil: 30, chantier: 'École Mendong', valeur: 900000 },
  { id: 4, reference: 'OUT-001', designation: 'Vibreur à béton', categorie: 'Outillage', unite: 'unité', stock: 3, seuil: 2, chantier: 'Immeuble Akwa', valeur: 450000 },
  { id: 5, reference: 'MAT-004', designation: 'Sable de rivière', categorie: 'Granulats', unite: 'm³', stock: 18, seuil: 25, chantier: 'Pont Wouri', valeur: 270000 },
];

const MOUVEMENTS_MOCK = [
  { id: 1, date: '2025-05-09', type: 'sortie', article: 'Ciment CEM II', qte: 20, chantier: 'Immeuble Akwa', operateur: 'Paul N.' },
  { id: 2, date: '2025-05-09', type: 'entree', article: 'Fer à béton HA12', qte: 2, chantier: 'Route Yassa', operateur: 'Jean M.' },
  { id: 3, date: '2025-05-08', type: 'sortie', article: 'Gravier 10/20', qte: 5, chantier: 'École Mendong', operateur: 'Alice B.' },
];

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    articles: MOCK,
    mouvements: MOUVEMENTS_MOCK,
    loading: false,
  },
  reducers: {
    setArticles(state, action) { state.articles = action.payload; },
    addMouvement(state, action) {
      const mouvement = { ...action.payload, id: Date.now() };
      state.mouvements.unshift(mouvement);
      // Keep article stock in sync; block negative stock for sorties
      const artIdx = state.articles.findIndex((a) => a.designation === mouvement.article);
      if (artIdx !== -1) {
        const delta = mouvement.type === 'entree' ? mouvement.qte : -mouvement.qte;
        const newStock = state.articles[artIdx].stock + delta;
        state.articles[artIdx].stock = Math.max(0, newStock);
      }
    },
    updateStock(state, action) {
      const idx = state.articles.findIndex((a) => a.id === action.payload.id);
      if (idx !== -1) state.articles[idx] = action.payload;
    },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setArticles, addMouvement, updateStock, setLoading } = stockSlice.actions;
export default stockSlice.reducer;
