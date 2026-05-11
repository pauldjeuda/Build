import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rapportsService } from '../../../services/rapports.service';
import toast from 'react-hot-toast';

const normRapport = (r) => ({
  id: r.id,
  chantier: r.Chantier?.nom ?? r.chantier_id,
  chantier_id: r.chantier_id,
  date: r.date,
  meteo: r.meteo,
  effectif: r.effectif,
  travaux: r.travaux,
  quantites: r.quantites,
  observations: r.observations,
  status: r.status,
  auteur: r.auteur?.name ?? r.auteur_id,
  auteur_id: r.auteur_id,
  validateur: r.validateur?.name ?? null,
  valide_at: r.valide_at,
  motif_rejet: r.motif_rejet,
  incidents: r.nb_incidents ?? 0,
});

export const fetchRapports = createAsyncThunk('rapports/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await rapportsService.list(params);
    return (res.data ?? res).map(normRapport);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createRapport = createAsyncThunk('rapports/create', async (data, { rejectWithValue }) => {
  try {
    const res = await rapportsService.create(data);
    return normRapport(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const submitRapport = createAsyncThunk('rapports/submit', async (id, { rejectWithValue }) => {
  try {
    const res = await rapportsService.submit(id);
    return normRapport(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const validateRapport = createAsyncThunk('rapports/validate', async (id, { rejectWithValue }) => {
  try {
    const res = await rapportsService.validate(id);
    return normRapport(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const rejectRapport = createAsyncThunk('rapports/reject', async ({ id, motif }, { rejectWithValue }) => {
  try {
    const res = await rapportsService.reject(id, motif);
    return normRapport(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const updateOne = (list, payload) => {
  const idx = list.findIndex((r) => r.id === payload.id);
  if (idx !== -1) list[idx] = payload;
};

const rapportsSlice = createSlice({
  name: 'rapports',
  initialState: {
    list: [],
    loading: false,
    error: null,
    filter: 'all',
  },
  reducers: {
    setFilter(state, action) { state.filter = action.payload; },
    addRapport(state, action) { state.list.unshift({ ...action.payload, id: Date.now() }); },
    updateRapport(state, action) { updateOne(state.list, action.payload); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRapports.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRapports.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchRapports.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message ?? 'Erreur'; })

      .addCase(createRapport.fulfilled, (state, { payload }) => {
        state.list.unshift(payload);
        toast.success('Rapport créé');
      })
      .addCase(createRapport.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur création rapport'))

      .addCase(submitRapport.fulfilled, (state, { payload }) => {
        updateOne(state.list, payload);
        toast.success('Rapport soumis — en attente validation CDT');
      })
      .addCase(submitRapport.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur soumission'))

      .addCase(validateRapport.fulfilled, (state, { payload }) => {
        updateOne(state.list, payload);
        toast.success('Rapport validé');
      })
      .addCase(validateRapport.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur validation'))

      .addCase(rejectRapport.fulfilled, (state, { payload }) => {
        updateOne(state.list, payload);
        toast.error('Rapport rejeté');
      })
      .addCase(rejectRapport.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur rejet'));
  },
});

export const { setFilter, addRapport, updateRapport } = rapportsSlice.actions;
export default rapportsSlice.reducer;
