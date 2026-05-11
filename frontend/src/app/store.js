import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/store/authSlice';
import chantiersReducer from '../modules/chantiers/store/chantiersSlice';
import rapportsReducer from '../modules/rapports/store/rapportsSlice';
import stockReducer from '../modules/stock/store/stockSlice';
import achatsReducer from '../modules/achats/store/achatsSlice';
import financeReducer from '../modules/finance/store/financeSlice';
import hseReducer from '../modules/hse/store/hseSlice';
import enginsReducer from '../modules/engins/store/enginsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chantiers: chantiersReducer,
    rapports: rapportsReducer,
    stock: stockReducer,
    achats: achatsReducer,
    finance: financeReducer,
    hse: hseReducer,
    engins: enginsReducer,
  },
});

export default store;
