import { createSlice } from '@reduxjs/toolkit';

// Get user from localStorage
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const token = localStorage.getItem('token') || null;
const role = localStorage.getItem('role') ? JSON.parse(localStorage.getItem('role')) : null;

const initialState = {
  user: user,
  token: token,
  role: role,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;