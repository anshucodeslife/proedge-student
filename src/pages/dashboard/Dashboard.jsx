import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, TrendingUp, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
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
    // API returns { progressPercentage, completedLessons, totalLessons, lessons: [...] }
    if (!courseProgress) return 0;

    // Use direct progressPercentage if available
    if (courseProgress.progressPercentage !== undefined) {
      return Math.round(courseProgress.progressPercentage);
    }

    // Fallback: calculate from lessons array
    if (courseProgress.lessons && Array.isArray(courseProgress.lessons)) {
      const completed = courseProgress.lessons.filter(l => l.completed).length;
      const total = courseProgress.lessons.length;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    // Fallback: use enrolled course progress if available
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course && course.progress !== undefined) {
      return Math.round(course.progress);
    }

    return 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{enrolledCourses.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {enrolledCourses.filter(c => getProgressPercentage(c.id) > 0 && getProgressPercentage(c.id) < 100).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {enrolledCourses.filter(c => getProgressPercentage(c.id) === 100).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="text-green-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
          <p className="text-gray-600">Start your learning journey by enrolling in a course</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progressPercent = getProgressPercentage(course.id);

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {progressPercent === 0 && <Badge variant="neutral">Not Started</Badge>}
                    {progressPercent > 0 && progressPercent < 100 && (
                      <Badge variant="warning">In Progress</Badge>
                    )}
                    {progressPercent === 100 && <Badge variant="success">Completed</Badge>}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    {progressPercent === 0 ? 'Start Learning' : 'Continue Learning'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
