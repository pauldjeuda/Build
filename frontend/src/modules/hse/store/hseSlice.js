import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hseService } from '../../../services/hse.service';
import toast from 'react-hot-toast';

const normIncident = (i) => ({
  id: i.id,
  date: i.date_incident,
  type: i.type,
  description: i.description,
  chantier: i.Chantier?.nom ?? i.chantier_id,
  chantier_id: i.chantier_id,
  gravite: i.gravite,
  status: i.status,
  declarePar: i.declarePar?.name ?? null,
  declare_par_id: i.declare_par_id,
  gerePar: i.gerePar?.name ?? null,
  victime: i.victimes,
  motif: i.motif_rejet,
  actions: i.actions ?? [],
});

const normInspection = (i) => ({
  id: i.id,
  date: i.date_inspection,
  chantier: i.Chantier?.nom ?? i.chantier_id,
  inspecteur: i.inspecteur?.name ?? null,
  type: i.type,
  statut: i.status,
  observations: (i.points_non_conformes ?? []).length,
});

export const fetchIncidents = createAsyncThunk('hse/fetchIncidents', async (params, { rejectWithValue }) => {
  try {
    const res = await hseService.listIncidents(params);
    return (res.data ?? res).map(normIncident);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const declareIncidentAsync = createAsyncThunk('hse/declare', async (data, { rejectWithValue }) => {
  try {
    const res = await hseService.declareIncident(data);
    return normIncident(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const prendreEnChargeAsync = createAsyncThunk('hse/prendreEnCharge', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await hseService.prendreEnCharge(id, data);
    return normIncident(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchInspections = createAsyncThunk('hse/fetchInspections', async (params, { rejectWithValue }) => {
  try {
    const res = await hseService.listInspections(params);
    return (res.data ?? res).map(normInspection);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const updateOne = (list, payload) => {
  const idx = list.findIndex((i) => i.id === payload.id);
  if (idx !== -1) list[idx] = payload;
};

const hseSlice = createSlice({
  name: 'hse',
  initialState: {
    incidents: [],
    inspections: [],
    loading: false,
    error: null,
  },
  reducers: {
    addIncident(state, action) { state.incidents.unshift({ ...action.payload, id: Date.now() }); },
    updateIncident(state, action) { updateOne(state.incidents, action.payload); },
    addInspection(state, action) { state.inspections.unshift({ ...action.payload, id: Date.now() }); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchIncidents.fulfilled, (state, { payload }) => { state.loading = false; state.incidents = payload; })
      .addCase(fetchIncidents.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message ?? 'Erreur'; })

      .addCase(declareIncidentAsync.fulfilled, (state, { payload }) => {
        state.incidents.unshift(payload);
        toast.success('Incident déclaré');
      })
      .addCase(declareIncidentAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur déclaration'))

      .addCase(prendreEnChargeAsync.fulfilled, (state, { payload }) => {
        updateOne(state.incidents, payload);
        toast.success('Incident pris en charge');
      })
      .addCase(prendreEnChargeAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'))

      .addCase(fetchInspections.fulfilled, (state, { payload }) => { state.inspections = payload; });
  },
});

export const { addIncident, updateIncident, addInspection } = hseSlice.actions;
export default hseSlice.reducer;
