import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Fetch enrolled courses
export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/student/courses');
      return response.data.data.courses;
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
      return response.data.data;
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
      return response.data.data.modules;
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
      return response.data.data;
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
      return response.data.data.progress;
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
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Course Details
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      })
      // Course Modules
      .addCase(fetchCourseModules.fulfilled, (state, action) => {
        state.currentModules = action.payload;
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
        state.progress[courseId] = action.payload;
      });
  },
});

export const { clearCurrentCourse, clearCurrentLesson } = courseSlice.actions;
export default courseSlice.reducer;
