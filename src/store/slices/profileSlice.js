import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// Fetch student profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/student/profile');
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Update student profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/student/profile', profileData);
      toast.success('Profile updated successfully');
      return response.data.data.profile;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await api.post('/student/change-password', { oldPassword, newPassword });
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default profileSlice.reducer;
