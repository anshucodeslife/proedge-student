import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import profileReducer from './slices/profileSlice';
import attendanceReducer from './slices/attendanceSlice';
import paymentReducer from './slices/paymentSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    profile: profileReducer,
    attendance: attendanceReducer,
    payments: paymentReducer,
    notifications: notificationReducer,
  }
});
