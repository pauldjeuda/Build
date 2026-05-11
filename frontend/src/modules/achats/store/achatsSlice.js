import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { achatsService } from '../../../services/achats.service';
import toast from 'react-hot-toast';

// Normalize API demande to UI shape
const normDemande = (d) => ({
  id: d.id,
  reference: d.reference,
  article: d.article,
  justification: d.justification,
  chantier: d.Chantier?.nom ?? d.chantier_id,
  chantier_id: d.chantier_id,
  montant: parseFloat(d.montant),
  demandeur: d.demandeur?.name ?? d.demandeur_id,
  date: d.created_at?.split('T')[0] ?? d.date,
  status: d.status,
  motif_rejet: d.motif_rejet,
});

const normCommande = (c) => ({
  id: c.id,
  reference: c.reference,
  fournisseur: c.Fournisseur?.nom ?? c.fournisseur_id,
  article: c.article,
  chantier: c.Chantier?.nom ?? c.chantier_id,
  montant: parseFloat(c.montant),
  dateCommande: c.date_commande,
  dateLivraison: c.date_livraison_prevue,
  status: c.status,
  demandeRef: c.AchatDemande?.reference ?? null,
});

// ─── Thunks ───────────────────────────────────────────────────────────────

export const fetchDemandes = createAsyncThunk('achats/fetchDemandes', async (_, { rejectWithValue }) => {
  try {
    const res = await achatsService.listDemandes();
    return (res.data ?? res).map(normDemande);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const submitDemande = createAsyncThunk('achats/submitDemande', async (data, { rejectWithValue }) => {
  try {
    const res = await achatsService.createDemande(data);
    return normDemande(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const doValidateCdt = createAsyncThunk('achats/validateCdt', async (id, { rejectWithValue }) => {
  try {
    const res = await achatsService.validateCdt(id);
    return normDemande(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const doValidateDaf = createAsyncThunk('achats/validateDaf', async (id, { rejectWithValue }) => {
  try {
    const res = await achatsService.validateDaf(id);
    return normDemande(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const doReceive = createAsyncThunk('achats/receive', async (id, { rejectWithValue }) => {
  try {
    const res = await achatsService.receive(id);
    return normDemande(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const doReject = createAsyncThunk('achats/reject', async ({ id, motif }, { rejectWithValue }) => {
  try {
    const res = await achatsService.reject(id, motif);
    return normDemande(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchCommandes = createAsyncThunk('achats/fetchCommandes', async (_, { rejectWithValue }) => {
  try {
    const res = await achatsService.listCommandes();
    return (res.data ?? res).map(normCommande);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchFournisseurs = createAsyncThunk('achats/fetchFournisseurs', async (_, { rejectWithValue }) => {
  try {
    const res = await achatsService.listFournisseurs();
    return res.data ?? res;
  } catch (err) {
    return rejectWithValue(err);
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────

const achatsSlice = createSlice({
  name: 'achats',
  initialState: {
    demandes: [],
    fournisseurs: [],
    commandes: [],
    loading: false,
    error: null,
  },
  reducers: {
    addDemande(state, action) {
      const num = String(state.demandes.length + 1).padStart(3, '0');
      state.demandes.unshift({ ...action.payload, id: Date.now(), reference: `DA-${new Date().getFullYear()}-${num}` });
    },
    updateDemande(state, action) {
      const idx = state.demandes.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.demandes[idx] = { ...state.demandes[idx], ...action.payload };
    },
    addCommande(state, action) {
      const num = String(state.commandes.length + 1).padStart(3, '0');
      state.commandes.unshift({ ...action.payload, id: Date.now(), reference: `BC-${new Date().getFullYear()}-${num}` });
    },
    updateCommande(state, action) {
      const idx = state.commandes.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.commandes[idx] = { ...state.commandes[idx], ...action.payload };
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload?.message ?? 'Erreur'; };

    builder
      .addCase(fetchDemandes.pending, pending)
      .addCase(fetchDemandes.fulfilled, (state, { payload }) => { state.loading = false; state.demandes = payload; })
      .addCase(fetchDemandes.rejected, rejected)

      .addCase(submitDemande.fulfilled, (state, { payload }) => { state.demandes.unshift(payload); })
      .addCase(submitDemande.rejected, (_, { payload }) => { toast.error(payload?.message ?? 'Erreur création demande'); })

      .addCase(doValidateCdt.fulfilled, (state, { payload }) => {
        const idx = state.demandes.findIndex((d) => d.id === payload.id);
        if (idx !== -1) state.demandes[idx] = payload;
        toast.success('Besoin validé — en attente approbation DAF');
      })
      .addCase(doValidateCdt.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur validation CDT'))

      .addCase(doValidateDaf.fulfilled, (state, { payload }) => {
        const idx = state.demandes.findIndex((d) => d.id === payload.id);
        if (idx !== -1) state.demandes[idx] = payload;
        toast.success('Budget approuvé — commande autorisée');
      })
      .addCase(doValidateDaf.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur approbation DAF'))

      .addCase(doReceive.fulfilled, (state, { payload }) => {
        const idx = state.demandes.findIndex((d) => d.id === payload.id);
        if (idx !== -1) state.demandes[idx] = payload;
        toast.success('Livraison réceptionnée');
      })
      .addCase(doReceive.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur réception'))

      .addCase(doReject.fulfilled, (state, { payload }) => {
        const idx = state.demandes.findIndex((d) => d.id === payload.id);
        if (idx !== -1) state.demandes[idx] = payload;
        toast.error('Demande rejetée');
      })
      .addCase(doReject.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur rejet'))

      .addCase(fetchCommandes.fulfilled, (state, { payload }) => { state.commandes = payload; })
      .addCase(fetchFournisseurs.fulfilled, (state, { payload }) => { state.fournisseurs = payload; });
  },
});

export const { addDemande, updateDemande, addCommande, updateCommande } = achatsSlice.actions;
export default achatsSlice.reducer;
