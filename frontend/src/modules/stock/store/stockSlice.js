import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from '../../../services/stock.service';
import toast from 'react-hot-toast';

const normArticle = (a) => ({
  id: a.id,
  reference: a.reference,
  designation: a.designation,
  categorie: a.categorie,
  unite: a.unite,
  stock: parseFloat(a.stock),
  seuil: parseFloat(a.stock_min),
  valeur: parseFloat(a.valeur ?? a.stock * a.prix_unitaire ?? 0),
  prix_unitaire: parseFloat(a.prix_unitaire ?? 0),
  localisation: a.localisation,
});

const normMouvement = (m) => ({
  id: m.id,
  date: m.created_at?.split('T')[0],
  type: m.type,
  article: m.StockArticle?.designation ?? m.article_id,
  qte: parseFloat(m.quantite),
  chantier: m.chantierDest?.nom ?? m.chantierSource?.nom ?? null,
  operateur: m.createur?.name ?? null,
  stock_avant: m.stock_avant,
  stock_apres: m.stock_apres,
});

export const fetchArticles = createAsyncThunk('stock/fetchArticles', async (params, { rejectWithValue }) => {
  try {
    const res = await stockService.listArticles(params);
    return (res.data ?? res).map(normArticle);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchMouvements = createAsyncThunk('stock/fetchMouvements', async (params, { rejectWithValue }) => {
  try {
    const res = await stockService.listMouvements(params);
    return (res.data ?? res).map(normMouvement);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createMouvementAsync = createAsyncThunk('stock/createMouvement', async (data, { rejectWithValue }) => {
  try {
    const res = await stockService.createMouvement(data);
    return normMouvement(res.data ?? res);
  } catch (err) {
    return rejectWithValue(err);
  }
});

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    articles: [],
    mouvements: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMouvement(state, action) {
      state.mouvements.unshift({ ...action.payload, id: Date.now() });
    },
    updateStock(state, action) {
      const idx = state.articles.findIndex((a) => a.id === action.payload.id);
      if (idx !== -1) state.articles[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchArticles.fulfilled, (state, { payload }) => { state.loading = false; state.articles = payload; })
      .addCase(fetchArticles.rejected, (state, { payload }) => { state.loading = false; state.error = payload?.message ?? 'Erreur'; })

      .addCase(fetchMouvements.fulfilled, (state, { payload }) => { state.mouvements = payload; })

      .addCase(createMouvementAsync.fulfilled, (state, { payload }) => {
        state.mouvements.unshift(payload);
        toast.success('Mouvement enregistré');
        // Refresh articles from server to get accurate stock
      })
      .addCase(createMouvementAsync.rejected, (_, { payload }) => toast.error(payload?.message ?? 'Erreur mouvement'));
  },
});

export const { addMouvement, updateStock } = stockSlice.actions;
export default stockSlice.reducer;
