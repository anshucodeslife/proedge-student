import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, TrendingUp, Clock, Award } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { fetchEnrolledCourses, fetchCourseProgress } from '../../store/slices/courseSlice';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { enrolledCourses, progress, loading } = useSelector(state => state.courses);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  useEffect(() => {
    // Fetch progress for each enrolled course
    if (enrolledCourses && enrolledCourses.length > 0) {
      enrolledCourses.forEach(course => {
        dispatch(fetchCourseProgress(course.id));
      });
    }
  }, [enrolledCourses, dispatch]);

  const getProgressPercentage = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;

    if (courseProgress.progressPercentage !== undefined) {
      return Math.round(courseProgress.progressPercentage);
    }

    if (courseProgress.lessons && Array.isArray(courseProgress.lessons)) {
      const completed = courseProgress.lessons.filter(l => l.completed).length;
      const total = courseProgress.lessons.length;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    const course = enrolledCourses.find(c => c.id === courseId);
    if (course && course.progress !== undefined) {
      return Math.round(course.progress);
    }

    return 0;
  };

  const inProgressCount = enrolledCourses.filter(c => {
    const progress = getProgressPercentage(c.id);
    return progress > 0 && progress < 100;
  }).length;

  const completedCount = enrolledCourses.filter(c => getProgressPercentage(c.id) === 100).length;

  return (
    <div className="w-full space-y-6">
      {/* Welcome Header - Compact */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center">
            <Award className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Welcome Back!</h1>
            <p className="text-sm text-slate-600">Continue your learning journey</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Clean Professional Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Courses */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold text-slate-800">{enrolledCourses.length}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">In Progress</p>
              <p className="text-3xl font-bold text-slate-800">{inProgressCount}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingUp className="text-orange-600" size={28} />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">Completed</p>
              <p className="text-3xl font-bold text-slate-800">{completedCount}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
              <Award className="text-blue-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center p-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading courses...</p>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-100">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No courses enrolled yet</h3>
          <p className="text-slate-600 mb-4">Start your learning journey by enrolling in a course</p>
          <Button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700">
            Browse Courses
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {enrolledCourses.map((course) => {
            const progressPercent = getProgressPercentage(course.id);

            return (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100"
              >
                {/* Course Thumbnail */}
                {course.thumbnail && (
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {/* Progress Badge */}
                    <div className="absolute top-3 right-3">
                      {progressPercent === 0 && (
                        <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          New
                        </span>
                      )}
                      {progressPercent > 0 && progressPercent < 100 && (
                        <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          {progressPercent}% Done
                        </span>
                      )}
                      {progressPercent === 100 && (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-orange-500 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                          <Award size={14} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-blue-600 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressPercent === 100
                            ? 'bg-gradient-to-r from-blue-500 to-orange-500'
                            : 'bg-gradient-to-r from-blue-600 to-blue-400'
                          }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Play size={18} />
                    <span>{progressPercent === 0 ? 'Start Learning' : 'Continue Learning'}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
