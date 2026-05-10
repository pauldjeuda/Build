import { createSlice } from '@reduxjs/toolkit';

const MOCK_DEPENSES = [
  { id: 1, date: '2025-05-09', libelle: 'Achat ciment 500 sacs', categorie: 'Matériaux', montant: 10000000, chantier: 'Immeuble Akwa', status: 'valide' },
  { id: 2, date: '2025-05-08', libelle: 'Carburant engins semaine 18', categorie: 'Carburant', montant: 1800000, chantier: 'Route Yassa', status: 'valide' },
  { id: 3, date: '2025-05-07', libelle: 'Location grues — mai 2025', categorie: 'Location engins', montant: 5500000, chantier: 'Pont Wouri', status: 'en_attente' },
  { id: 4, date: '2025-05-06', libelle: 'Salaires ouvriers — semaine 18', categorie: 'Main d\'œuvre', montant: 8200000, chantier: 'Tous', status: 'valide' },
];

const MOCK_BUDGETS = [
  { id: 1, chantier: 'Immeuble Akwa', budgetTotal: 450000000, depenses: 306000000, engagements: 45000000, disponible: 99000000 },
  { id: 2, chantier: 'Route Yassa', budgetTotal: 280000000, depenses: 176400000, engagements: 28000000, disponible: 75600000 },
  { id: 3, chantier: 'École Mendong', budgetTotal: 95000000, depenses: 80750000, engagements: 5000000, disponible: 9250000 },
  { id: 4, chantier: 'Pont Wouri', budgetTotal: 850000000, depenses: 127500000, engagements: 85000000, disponible: 637500000 },
];

const MOCK_FACTURES = [
  { id: 1, reference: 'FAC-2025-001', type: 'fournisseur', tiers: 'CIM Cameroun', libelle: 'Ciment CEM II — Immeuble Akwa', montant: 10000000, dateEmission: '2025-05-01', dateEcheance: '2025-05-31', status: 'ouvert' },
  { id: 2, reference: 'FAC-2025-002', type: 'client', tiers: 'SOGELERG S.A.', libelle: 'Acompte travaux — Route Yassa', montant: 50000000, dateEmission: '2025-04-15', dateEcheance: '2025-04-30', status: 'paye' },
  { id: 3, reference: 'FAC-2025-003', type: 'fournisseur', tiers: 'HYDROCAM', libelle: 'Location engins — avril 2025', montant: 5500000, dateEmission: '2025-04-01', dateEcheance: '2025-04-15', status: 'en_retard' },
  { id: 4, reference: 'FAC-2025-004', type: 'client', tiers: 'MAETUR', libelle: 'Facture 2 — École Primaire Mendong', montant: 25000000, dateEmission: '2025-05-05', dateEcheance: '2025-06-05', status: 'ouvert' },
  { id: 5, reference: 'FAC-2025-005', type: 'fournisseur', tiers: 'SOCATRAF', libelle: 'Granulats — mars 2025', montant: 900000, dateEmission: '2025-03-20', dateEcheance: '2025-04-20', status: 'paye' },
  { id: 6, reference: 'FAC-2025-006', type: 'client', tiers: 'MINTP', libelle: 'Situation 1 — Pont Wouri Phase 2', montant: 120000000, dateEmission: '2025-05-08', dateEcheance: '2025-06-08', status: 'ouvert' },
];

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    depenses: MOCK_DEPENSES,
    budgets: MOCK_BUDGETS,
    factures: MOCK_FACTURES,
    loading: false,
  },
  reducers: {
    addDepense(state, action) {
      const depense = { ...action.payload, id: Date.now() };
      state.depenses.unshift(depense);
      // Keep corresponding budget in sync
      const budgetIdx = state.budgets.findIndex((b) => b.chantier === depense.chantier);
      if (budgetIdx !== -1) {
        state.budgets[budgetIdx].depenses += depense.montant;
        state.budgets[budgetIdx].disponible -= depense.montant;
      }
    },
    addFacture(state, action) {
      const num = String(state.factures.length + 1).padStart(3, '0');
      state.factures.unshift({ ...action.payload, id: Date.now(), reference: `FAC-2025-${num}`, status: 'ouvert' });
    },
    updateFacture(state, action) {
      const idx = state.factures.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) state.factures[idx] = { ...state.factures[idx], ...action.payload };
    },
    setLoading(state, action) { state.loading = action.payload; },
  },
});

export const { addDepense, addFacture, updateFacture, setLoading } = financeSlice.actions;
export default financeSlice.reducer;
