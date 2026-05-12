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

export const fetchMaintenances = createAsyncThunk('engins/fetchMaintenances', async (enginId, { rejectWithValue }) => {
  try {
    const res = await enginsService.listMaintenances(enginId);
    return { enginId, items: res.data ?? res };
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createMaintenanceAsync = createAsyncThunk('engins/createMaintenance', async ({ enginId, data }, { rejectWithValue }) => {
  try {
    const res = await enginsService.createMaintenance(enginId, data);
    return res.data ?? res;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const cloturerMaintenanceAsync = createAsyncThunk('engins/cloturerMaintenance', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await enginsService.clotureMaintenance(id, data);
    return res.data ?? res;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchCarnet = createAsyncThunk('engins/fetchCarnet', async (enginId, { rejectWithValue }) => {
  try {
    const res = await enginsService.listCarnet(enginId);
    return { enginId, items: res.data ?? res };
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const addCarnetEntryAsync = createAsyncThunk('engins/addCarnetEntry', async ({ enginId, data }, { rejectWithValue }) => {
  try {
    const res = await enginsService.addCarnetEntry(enginId, data);
    return res.data ?? res;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const enginsSlice = createSlice({
  name: 'engins',
  initialState: {
    list: [],
    maintenances: [],
    carnet: [],
    loading: false,
    error: null,
  },
  reducers: {
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
      })

      .addCase(fetchMaintenances.fulfilled, (state, { payload }) => { state.maintenances = payload.items; })

      .addCase(createMaintenanceAsync.fulfilled, (state, { payload }) => {
        state.maintenances.unshift(payload);
        toast.success('Maintenance créée');
      })
      .addCase(createMaintenanceAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'))

      .addCase(cloturerMaintenanceAsync.fulfilled, (state, { payload }) => {
        const idx = state.maintenances.findIndex((m) => m.id === payload.id);
        if (idx !== -1) state.maintenances[idx] = payload;
        toast.success('Maintenance clôturée');
      })
      .addCase(cloturerMaintenanceAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'))

      .addCase(fetchCarnet.fulfilled, (state, { payload }) => { state.carnet = payload.items; })

      .addCase(addCarnetEntryAsync.fulfilled, (state, { payload }) => {
        state.carnet.unshift(payload);
        toast.success('Entrée carnet ajoutée');
      })
      .addCase(addCarnetEntryAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur'));
  },
});

export const { updateEngin } = enginsSlice.actions;
export default enginsSlice.reducer;
