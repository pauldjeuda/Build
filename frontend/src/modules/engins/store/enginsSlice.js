import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enginsService } from '../../../services/engins.service';
import toast from 'react-hot-toast';

const normEngin = (e) => ({
  id: e.id,
  code: e.immatriculation,
  immatriculation: e.immatriculation,
  designation: `${e.type} ${e.marque ?? ''} ${e.modele ?? ''}`.trim(),
  type: e.type,
  marque: e.marque,
  chantier: e.chantierActuel?.nom ?? null,
  chantier_id: e.chantier_id,
  status: e.status,
  heures: e.heures_total ?? 0,
  prochaineMaintenance: e.prochaine_maintenance ?? null,
  responsable: e.responsable?.name ?? null,
});

export const fetchEngins = createAsyncThunk('engins/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await enginsService.list(params);
    return (res.data ?? res).map(normEngin);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createEnginAsync = createAsyncThunk('engins/create', async (data, { rejectWithValue }) => {
  try {
    const res = await enginsService.create(data);
    return normEngin(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateEnginAsync = createAsyncThunk('engins/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await enginsService.update(id, data);
    return normEngin(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const enginsSlice = createSlice({
  name: 'engins',
  initialState: {
    list: [],
    maintenances: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMaintenance(state, action) { state.maintenances.unshift({ ...action.payload, id: Date.now() }); },
    updateEngin(state, action) {
      const idx = state.list.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEngins.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEngins.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchEngins.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message ?? 'Erreur'; })

      .addCase(createEnginAsync.fulfilled, (state, { payload }) => {
        state.list.unshift(payload);
        toast.success('Engin créé');
      })
      .addCase(createEnginAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'))

      .addCase(updateEnginAsync.fulfilled, (state, { payload }) => {
        const idx = state.list.findIndex((e) => e.id === payload.id);
        if (idx !== -1) state.list[idx] = payload;
        toast.success('Engin mis à jour');
      });
  },
});

export const { addMaintenance, updateEngin } = enginsSlice.actions;
export default enginsSlice.reducer;
