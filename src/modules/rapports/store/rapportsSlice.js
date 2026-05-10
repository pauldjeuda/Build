import { createSlice } from '@reduxjs/toolkit';

const MOCK = [
  { id: 1, chantier: 'Immeuble Akwa', date: '2025-05-09', meteo: 'Ensoleillé', effectif: 24, travaux: 'Coulage dalle niveau 3', status: 'valide', auteur: 'Paul Ngono', incidents: 0 },
  { id: 2, chantier: 'Route Yassa', date: '2025-05-09', meteo: 'Nuageux', effectif: 18, travaux: 'Pose bordures km 4–5', status: 'soumis', auteur: 'Jean Mbarga', incidents: 1 },
  { id: 3, chantier: 'École Mendong', date: '2025-05-08', meteo: 'Pluie', effectif: 12, travaux: 'Arrêt chantier pluie — travaux intérieurs', status: 'valide', auteur: 'Alice Bello', incidents: 0 },
  { id: 4, chantier: 'Immeuble Akwa', date: '2025-05-08', meteo: 'Ensoleillé', effectif: 26, travaux: 'Ferraillage poteaux niveau 4', status: 'brouillon', auteur: 'Paul Ngono', incidents: 0 },
];

const rapportsSlice = createSlice({
  name: 'rapports',
  initialState: {
    list: MOCK,
    loading: false,
    filter: 'all',
  },
  reducers: {
    setRapports(state, action) { state.list = action.payload; },
    addRapport(state, action) { state.list.unshift({ ...action.payload, id: Date.now() }); },
    updateRapport(state, action) {
      const idx = state.list.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    setFilter(state, action) { state.filter = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setRapports, addRapport, updateRapport, setFilter, setLoading } = rapportsSlice.actions;
export default rapportsSlice.reducer;
