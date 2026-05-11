import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chantiersService } from '../../../services/chantiers.service';

const normChantier = (c) => ({
  id: c.id,
  nom: c.nom,
  description: c.description,
  localisation: c.localisation,
  budget: parseFloat(c.budget || 0),
  depenses: parseFloat(c.depenses || 0),
  avancement: c.avancement ?? 0,
  status: c.status,
  chef: c.chef?.name ?? null,
  chef_id: c.chef_id,
  conducteur: c.conducteur?.name ?? null,
  conducteur_id: c.conducteur_id,
  dateDebut: c.date_debut,
  dateFin: c.date_fin,
});

export const fetchChantiers = createAsyncThunk('chantiers/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await chantiersService.list(params);
    return (res.data ?? res).map(normChantier);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createChantier = createAsyncThunk('chantiers/create', async (data, { rejectWithValue }) => {
  try {
    const res = await chantiersService.create(data);
    return normChantier(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateChantierAsync = createAsyncThunk('chantiers/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await chantiersService.update(id, data);
    return normChantier(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const chantiersSlice = createSlice({
  name: 'chantiers',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
    filter: 'all',
  },
  reducers: {
    setSelected(state, action) { state.selected = action.payload; },
    setFilter(state, action) { state.filter = action.payload; },
    // Synchronous fallback
    addChantier(state, action) { state.list.unshift({ ...action.payload, id: Date.now() }); },
    updateChantier(state, action) {
      const idx = state.list.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChantiers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchChantiers.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchChantiers.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message ?? 'Erreur'; })

      .addCase(createChantier.fulfilled, (state, { payload }) => { state.list.unshift(payload); })
      .addCase(updateChantierAsync.fulfilled, (state, { payload }) => {
        const idx = state.list.findIndex((c) => c.id === payload.id);
        if (idx !== -1) state.list[idx] = payload;
      });
  },
});

export const { setSelected, setFilter, addChantier, updateChantier } = chantiersSlice.actions;
export default chantiersSlice.reducer;
