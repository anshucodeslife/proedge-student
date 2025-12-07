import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Fetch enrolled courses
export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/student/courses');
      // Handle both { data: { courses: [...] } } and { data: [...] } structures
      const data = response.data.data;
      return Array.isArray(data) ? data : (data.courses || data || []);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

// Fetch course details
export const fetchCourseDetails = createAsyncThunk(
  'courses/fetchCourseDetails',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/courses/${courseId}`);
      // Backend returns { course, enrollment } structure
      const data = response.data.data;
      return data.course || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course details');
    }
  }
);

// Fetch course modules
export const fetchCourseModules = createAsyncThunk(
  'courses/fetchCourseModules',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/courses/${courseId}/modules`);
      // Handle both { data: { modules: [...] } } and { data: [...] } structures
      const data = response.data.data;
      return Array.isArray(data) ? data : (data.modules || data || []);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch modules');
    }
  }
);

// Fetch lesson details
export const fetchLessonDetails = createAsyncThunk(
  'courses/fetchLessonDetails',
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/lessons/${lessonId}`);
      const data = response.data.data;
      return data.lesson || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson');
    }
  }
);

// Fetch course progress
export const fetchCourseProgress = createAsyncThunk(
  'courses/fetchCourseProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/courses/${courseId}/progress`);
      const data = response.data.data;
      return data.progress || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress');
    }
  }
);

const initialState = {
  enrolledCourses: [],
  currentCourse: null,
  currentModules: [],
  currentLesson: null,
  progress: {},
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.currentModules = [];
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Enrolled Courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload || [];
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.enrolledCourses = [];
      })
      // Course Details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Course Modules
      .addCase(fetchCourseModules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseModules.fulfilled, (state, action) => {
        state.loading = false;
        state.currentModules = action.payload || [];
      })
      .addCase(fetchCourseModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentModules = [];
      })
      // Lesson Details
      .addCase(fetchLessonDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLessonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload;
      })
      .addCase(fetchLessonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Course Progress
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        const courseId = action.meta.arg;
        state.progress[courseId] = action.payload || [];
      });
  },
});

export const { clearCurrentCourse, clearCurrentLesson } = courseSlice.actions;
export default courseSlice.reducer;
