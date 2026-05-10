import { createSlice } from '@reduxjs/toolkit';

const MOCK = [
  { id: 1, nom: 'Immeuble Akwa', localisation: 'Douala, Akwa', avancement: 68, status: 'actif', budget: 450000000, depenses: 306000000, chef: 'Paul Ngono', dateDebut: '2024-01-15', dateFin: '2025-06-30', description: 'Construction immeuble R+6 usage mixte' },
  { id: 2, nom: 'Route Yassa–Bonabéri', localisation: 'Douala, Yassa', avancement: 42, status: 'en_retard', budget: 280000000, depenses: 176400000, chef: 'Jean Mbarga', dateDebut: '2024-03-01', dateFin: '2025-03-01', description: 'Réhabilitation voirie urbaine 12 km' },
  { id: 3, nom: 'École Primaire Mendong', localisation: 'Yaoundé, Mendong', avancement: 85, status: 'actif', budget: 95000000, depenses: 80750000, chef: 'Alice Bello', dateDebut: '2023-09-01', dateFin: '2024-12-31', description: 'Construction 6 salles de classe + bureaux' },
  { id: 4, nom: 'Pont Wouri Phase 2', localisation: 'Douala, Wouri', avancement: 15, status: 'actif', budget: 850000000, depenses: 127500000, chef: 'Marc Foning', dateDebut: '2024-06-01', dateFin: '2026-12-31', description: 'Élargissement pont + ouvrages annexes' },
];

const chantiersSlice = createSlice({
  name: 'chantiers',
  initialState: {
    list: MOCK,
    selected: null,
    loading: false,
    filter: 'all',
  },
  reducers: {
    setChantiers(state, action) { state.list = action.payload; },
    setSelected(state, action) { state.selected = action.payload; },
    addChantier(state, action) { state.list.unshift({ ...action.payload, id: Date.now() }); },
    updateChantier(state, action) {
      const idx = state.list.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    setFilter(state, action) { state.filter = action.payload; },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setChantiers, setSelected, addChantier, updateChantier, setFilter, setLoading } = chantiersSlice.actions;
export default chantiersSlice.reducer;
