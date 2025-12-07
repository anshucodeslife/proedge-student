import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails, fetchCourseModules, fetchCourseProgress } from '../../store/slices/courseSlice';
import { Button } from '../../components/ui/Button';
import { PlayCircle, Clock, BookOpen, CheckCircle, Lock } from 'lucide-react';

export const CourseDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse, currentModules, progress, loading } = useSelector(state => state.courses);
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
      dispatch(fetchCourseModules(courseId));
      dispatch(fetchCourseProgress(courseId));
    }
  }, [dispatch, courseId]);

  if (loading || !currentCourse) {
    return <div className="text-center py-10 text-slate-400">Loading course details...</div>;
  }

  // Get progress from Redux store
  const courseProgress = progress[courseId];
  const progressPercentage = courseProgress?.progressPercentage || currentCourse.progress || 0;
  const completedLessons = courseProgress?.completedLessons || 0;
  const totalLessons = courseProgress?.totalLessons || currentModules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
          {currentCourse.thumbnail && !imageError ? (
            <img
              src={currentCourse.thumbnail}
              alt={currentCourse.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Try fallback to image field if thumbnail fails, otherwise show error state
                if (currentCourse.image && e.target.src !== currentCourse.image && !currentCourse.image.includes(currentCourse.thumbnail)) {
                  e.target.src = currentCourse.image;
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
              <BookOpen size={48} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">{currentCourse.title}</h1>
          <p className="text-slate-500">{currentCourse.description || 'No description available'}</p>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2"><Clock size={16} /> <span>{totalLessons} Lessons</span></div>
            <div className="flex items-center gap-2"><CheckCircle size={16} /> <span>{completedLessons} Completed</span></div>
            <div className="flex items-center gap-2"><BookOpen size={16} /> <span>{Math.round(progressPercentage)}% Complete</span></div>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => navigate(`/courses/${courseId}/learn`)}
              icon={PlayCircle}
              className="w-full md:w-auto"
            >
              {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
            </Button>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {currentModules && currentModules.length > 0 ? (
              currentModules.map((module) => (
                <div key={module.id} className="p-4">
                  <h3 className="font-bold text-slate-700 mb-3">{module.title}</h3>
                  <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                    {module.lessons && module.lessons.length > 0 ? (
                      module.lessons.map((lesson) => {
                        // Check if lesson is completed from progress
                        const lessonCompleted = courseProgress?.lessons?.find(l => l.id === lesson.id)?.completed;
                        return (
                          <div key={lesson.id} className="flex items-center gap-3 text-sm text-slate-600 py-1">
                            {lessonCompleted ? (
                              <CheckCircle size={16} className="text-emerald-500" />
                            ) : (
                              <PlayCircle size={16} className="text-indigo-600" />
                            )}
                            <span className={lessonCompleted ? 'text-emerald-600' : ''}>{lesson.title}</span>
                            <span className="ml-auto text-xs text-slate-400">
                              {lesson.durationSec ? `${Math.floor(lesson.durationSec / 60)}:${String(lesson.durationSec % 60).padStart(2, '0')}` : '--:--'}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400 italic">No lessons available yet</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <BookOpen size={48} className="mx-auto mb-2 opacity-50" />
                <p>No modules available yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Course Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Completion</span>
                  <span className="font-semibold text-indigo-600">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-slate-500">
                <p>{completedLessons} of {totalLessons} lessons completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
