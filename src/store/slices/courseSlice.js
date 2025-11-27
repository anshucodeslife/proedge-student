import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../../api';

export const fetchEnrolledCourses = createAsyncThunk('courses/fetchEnrolled', async () => {
  const response = await courseApi.getEnrolledCourses();
  return response.data;
});

export const fetchCourseDetails = createAsyncThunk('courses/fetchDetails', async (courseId) => {
  const [course, modules] = await Promise.all([
    courseApi.getCourseDetails(courseId),
    courseApi.getModules(courseId)
  ]);
  return { course: course.data, modules: modules.data };
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    enrolled: [],
    currentCourse: null,
    modules: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.modules = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolled = action.payload;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.currentCourse = action.payload.course;
        state.modules = action.payload.modules;
      });
  }
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
