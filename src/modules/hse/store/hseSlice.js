import { createSlice } from '@reduxjs/toolkit';

const MOCK_INCIDENTS = [
  { id: 1, date: '2025-05-08', type: 'Accident léger', description: 'Coupure main — ouvrier ferraillage', chantier: 'Immeuble Akwa', gravite: 'faible', status: 'resolu', victime: 'Emmanuel T.' },
  { id: 2, date: '2025-05-05', type: 'Presque-accident', description: 'Chute matériau depuis échafaudage', chantier: 'Pont Wouri', gravite: 'moyen', status: 'en_cours', victime: null },
  { id: 3, date: '2025-04-28', type: 'Incident matériel', description: 'Rupture câble grue — arrêt 2h', chantier: 'Immeuble Akwa', gravite: 'moyen', status: 'resolu', victime: null },
];

const MOCK_INSPECTIONS = [
  { id: 1, date: '2025-05-09', chantier: 'Immeuble Akwa', inspecteur: 'Sylvie Mendo', type: 'Périodique', statut: 'conforme', observations: 2 },
  { id: 2, date: '2025-05-06', chantier: 'Route Yassa', inspecteur: 'Paul Ngono', type: 'Inopinée', statut: 'non_conforme', observations: 5 },
];

const hseSlice = createSlice({
  name: 'hse',
  initialState: {
    incidents: MOCK_INCIDENTS,
    inspections: MOCK_INSPECTIONS,
    loading: false,
  },
  reducers: {
    addIncident(state, action) { state.incidents.unshift({ ...action.payload, id: Date.now() }); },
    addInspection(state, action) { state.inspections.unshift({ ...action.payload, id: Date.now() }); },
    updateIncident(state, action) {
      const idx = state.incidents.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) state.incidents[idx] = action.payload;
    },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { addIncident, addInspection, updateIncident, setLoading } = hseSlice.actions;
export default hseSlice.reducer;
