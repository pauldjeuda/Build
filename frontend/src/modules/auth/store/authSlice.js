import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('buildpro_user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored ? JSON.parse(stored) : null,
    isAuthenticated: !!stored,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('buildpro_user', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('buildpro_token', action.payload.token);
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('buildpro_user');
      localStorage.removeItem('buildpro_token');
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
