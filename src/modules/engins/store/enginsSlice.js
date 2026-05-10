import { createSlice } from '@reduxjs/toolkit';

const MOCK = [
  { id: 1, code: 'ENG-001', designation: 'Grue tour 40T', marque: 'Liebherr', immatriculation: 'LT-2019-001', chantier: 'Immeuble Akwa', status: 'operationnel', prochaineMaintenance: '2025-06-15', heures: 2840 },
  { id: 2, code: 'ENG-002', designation: 'Pelle hydraulique 25T', marque: 'CAT 320', immatriculation: 'LT-2020-003', chantier: 'Route Yassa', status: 'operationnel', prochaineMaintenance: '2025-05-20', heures: 4210 },
  { id: 3, code: 'ENG-003', designation: 'Compacteur vibrant 12T', marque: 'BOMAG', immatriculation: 'LT-2021-007', chantier: 'Route Yassa', status: 'en_panne', prochaineMaintenance: null, heures: 1680 },
  { id: 4, code: 'ENG-004', designation: 'Camion-benne 20T', marque: 'MAN TGS', immatriculation: 'LT-2022-012', chantier: 'Pont Wouri', status: 'maintenance', prochaineMaintenance: '2025-05-12', heures: 3320 },
];

const enginsSlice = createSlice({
  name: 'engins',
  initialState: {
    list: MOCK,
    maintenances: [],
    loading: false,
  },
  reducers: {
    setEngins(state, action) { state.list = action.payload; },
    updateEngin(state, action) {
      const idx = state.list.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    addMaintenance(state, action) { state.maintenances.unshift({ ...action.payload, id: Date.now() }); },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { setEngins, updateEngin, addMaintenance, setLoading } = enginsSlice.actions;
export default enginsSlice.reducer;
