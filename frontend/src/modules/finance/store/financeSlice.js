import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financeService } from '../../../services/finance.service';
import toast from 'react-hot-toast';

const normDepense = (d) => ({
  id: d.id,
  date: d.date,
  libelle: d.description,
  categorie: d.categorie,
  montant: parseFloat(d.montant),
  chantier: d.Chantier?.nom ?? d.chantier_id,
  chantier_id: d.chantier_id,
  status: 'valide',
});

const normFacture = (f) => ({
  id: f.id,
  reference: f.numero,
  type: 'fournisseur',
  tiers: f.Fournisseur?.nom ?? null,
  libelle: `${f.Chantier?.nom ?? ''} — facture`,
  montant: parseFloat(f.montant_ttc),
  montant_ht: parseFloat(f.montant_ht),
  montant_encaisse: parseFloat(f.montant_encaisse ?? 0),
  dateEmission: f.date_emission,
  dateEcheance: f.date_echeance,
  status: f.status,
});

export const fetchDepenses = createAsyncThunk('finance/fetchDepenses', async (params, { rejectWithValue }) => {
  try {
    const res = await financeService.listDepenses(params);
    return (res.data ?? res).map(normDepense);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchFactures = createAsyncThunk('finance/fetchFactures', async (params, { rejectWithValue }) => {
  try {
    const res = await financeService.listFactures(params);
    return (res.data ?? res).map(normFacture);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchDashboard = createAsyncThunk('finance/dashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await financeService.dashboard();
    return res.data ?? res;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createDepenseAsync = createAsyncThunk('finance/createDepense', async (data, { rejectWithValue }) => {
  try {
    const res = await financeService.createDepense(data);
    return normDepense(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createFactureAsync = createAsyncThunk('finance/createFacture', async (data, { rejectWithValue }) => {
  try {
    const res = await financeService.createFacture(data);
    return normFacture(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const payerFactureAsync = createAsyncThunk('finance/payerFacture', async ({ id, montant }, { rejectWithValue }) => {
  try {
    const res = await financeService.payerFacture(id, montant);
    return normFacture(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    depenses: [],
    budgets: [],
    factures: [],
    synthese: null,
    loading: false,
    error: null,
  },
  reducers: {
    addDepense(state, action) { state.depenses.unshift({ ...action.payload, id: Date.now() }); },
    addFacture(state, action) { state.factures.unshift({ ...action.payload, id: Date.now() }); },
    updateFacture(state, action) {
      const idx = state.factures.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) state.factures[idx] = { ...state.factures[idx], ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepenses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDepenses.fulfilled, (state, { payload }) => { state.loading = false; state.depenses = payload; })
      .addCase(fetchDepenses.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message ?? 'Erreur'; })

      .addCase(fetchFactures.fulfilled, (state, { payload }) => { state.factures = payload; })

      .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
        state.synthese = payload.synthese;
        state.budgets = (payload.chantiers ?? []).map((c) => ({
          id: c.id,
          chantier: c.nom,
          budgetTotal: parseFloat(c.budget ?? 0),
          depenses: parseFloat(c.depenses ?? 0),
          engagements: 0,
          disponible: parseFloat(c.budget ?? 0) - parseFloat(c.depenses ?? 0),
        }));
      })

      .addCase(createDepenseAsync.fulfilled, (state, { payload }) => {
        state.depenses.unshift(payload);
        toast.success('Dépense enregistrée');
      })
      .addCase(createDepenseAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'))

      .addCase(createFactureAsync.fulfilled, (state, { payload }) => {
        state.factures.unshift(payload);
        toast.success('Facture créée');
      })
      .addCase(createFactureAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'))

      .addCase(payerFactureAsync.fulfilled, (state, { payload }) => {
        const idx = state.factures.findIndex((f) => f.id === payload.id);
        if (idx !== -1) state.factures[idx] = payload;
        toast.success('Facture marquée payée');
      })
      .addCase(payerFactureAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'));
  },
});

export const { addDepense, addFacture, updateFacture } = financeSlice.actions;
export default financeSlice.reducer;
