import { mockUser, mockCourses, mockModules, mockLessons, mockNotifications, mockAttendance } from './mockData';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (credentials) => {
    await delay(800);
    if (credentials.email === 'student@proedge.com' && credentials.password === 'password') {
      return { data: { token: 'mock-jwt-token', user: mockUser } };
    }
    throw new Error('Invalid credentials');
  },
  verifyOtp: async (otp) => {
    await delay(500);
    return { data: { success: true } };
  },
  forgotPassword: async (email) => {
    await delay(500);
    return { data: { message: 'OTP sent' } };
  }
};

export const courseApi = {
  getEnrolledCourses: async () => {
    await delay(600);
    return { data: mockCourses };
  },
  getCourseDetails: async (courseId) => {
    await delay(400);
    const course = mockCourses.find(c => c.id === courseId);
    return { data: course };
  },
  getModules: async (courseId) => {
    await delay(400);
    return { data: mockModules[courseId] || [] };
  },
  getLessons: async (moduleId) => {
    await delay(300);
    return { data: mockLessons[moduleId] || [] };
  }
};

export const studentApi = {
  getProfile: async () => {
    await delay(300);
    return { data: mockUser };
  },
  getNotifications: async () => {
    await delay(400);
    return { data: mockNotifications };
  },
  getAttendance: async () => {
    await delay(400);
    return { data: mockAttendance };
  },
  logWatch: async (data) => {
    console.log('Watch log:', data);
    return { data: { success: true } };
  }
};
