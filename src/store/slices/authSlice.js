import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, studentApi } from '../../api';

export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
  const response = await authApi.login(credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
  const response = await studentApi.getProfile();
  return response.data;
});

export const signupUser = createAsyncThunk('auth/signup', async (userData) => {
  const response = await authApi.signupWithId(userData);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        // Check if backend returns token on signup, otherwise user needs to login.
        // Assuming signup doesn't auto-login based on typical flows (or it might return token/user).
        // If it returns token, we can auto-login:
        // state.token = action.payload.token;
        // state.user = action.payload.user;
        // For now, let's assume they need to login or verifying email.
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
