import api from './axios';

// Helper to unwrap response data (since backend returns { success: true, data: ... })
const unwrap = async (promise) => {
  const response = await promise;
  // If the backend wraps data in a 'data' property (standard success response), return that.
  // Otherwise return response.data as is (fallback).
  // The slices expect { data: ... } structure often because they were built for mocks returning { data: ... }
  // or axios structure.
  // Existing mock: return { data: mockUser }
  // Real axios: response.data = { success: true, data: user, ... }
  // We want to return structure compatible with slice expectations.
  // Slice: response.data.token -> expects user object/payload at .data

  return { data: response.data.data || response.data };
};

export const authApi = {
  login: (credentials) => unwrap(api.post('/auth/login', credentials)),
  verifyOtp: (data) => unwrap(api.post('/auth/verify-otp', data)), // Adjusted based on auth.enhanced.routes
  forgotPassword: (email) => unwrap(api.post('/auth/forgot-password', { email })),
  sendOtp: (email) => unwrap(api.post('/auth/send-otp', { email })),
  verifyStudentId: (studentId) => unwrap(api.post('/auth/verify-student-id', { studentId })),
  signupWithId: (data) => unwrap(api.post('/auth/signup-with-id', data)),
  resetPassword: (data) => unwrap(api.post('/auth/reset-password', data))
};

export const courseApi = {
  getEnrolledCourses: () => unwrap(api.get('/student/courses')),
  getCourseDetails: (courseId) => unwrap(api.get(`/student/courses/${courseId}`)),
  getModules: (courseId) => unwrap(api.get(`/student/courses/${courseId}/modules`)),
  getLessons: (lessonId) => unwrap(api.get(`/student/lessons/${lessonId}`)),
  getCourseProgress: (courseId) => unwrap(api.get(`/student/courses/${courseId}/progress`))
};

export const studentApi = {
  getProfile: () => unwrap(api.get('/users/profile')),
  // Notifications not yet implemented in backend student routes, or I missed it.
  // Checking notification.routes.js might be needed. For now keeping basic fetch.
  getNotifications: () => unwrap(api.get('/notifications')),
  // Attendance likely separate.
  // getAttendance: () => unwrap(api.get('/student/attendance')), // Commented out until verify endpoint
  getLessons: (lessonId) => unwrap(api.get(`/student/lessons/${lessonId}`)),
  logWatch: (data) => {
    return unwrap(api.post(`/student/lessons/${data.lessonId}/progress`, {
      watchedSec: data.watchedSec,
      lastPosition: data.lastPosition || data.watchedSec,
      completed: data.completed || false
    }));
  }
};
