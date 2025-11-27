import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../../store/slices/courseSlice';
import { Button } from '../../components/ui/Button';
import { PlayCircle, Clock, BookOpen, CheckCircle, Lock } from 'lucide-react';

export const CourseDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse, modules, loading } = useSelector(state => state.courses);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
    }
  }, [dispatch, courseId]);

  if (loading || !currentCourse) {
    return <div className="text-center py-10 text-slate-400">Loading course details...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden bg-slate-100">
          <img src={currentCourse.thumbnail} alt={currentCourse.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">{currentCourse.title}</h1>
          <p className="text-slate-500">{currentCourse.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2"><Clock size={16} /> <span>{currentCourse.totalLessons} Lessons</span></div>
            <div className="flex items-center gap-2"><BookOpen size={16} /> <span>{currentCourse.progress}% Complete</span></div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => navigate(`/courses/${courseId}/learn`)}
              icon={PlayCircle}
              className="w-full md:w-auto"
            >
              {currentCourse.progress > 0 ? 'Continue Learning' : 'Start Course'}
            </Button>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {modules.map((module) => (
              <div key={module.id} className="p-4">
                <h3 className="font-bold text-slate-700 mb-3">{module.title}</h3>
                <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 py-1">
                      <PlayCircle size={16} className="text-indigo-600" />
                      <span>Lesson {i}: Introduction to {module.title}</span>
                      <span className="ml-auto text-xs text-slate-400">10:00</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Study Materials</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">Course Syllabus.pdf</p>
                  <p className="text-xs text-slate-400">2.4 MB</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">Project Assets.zip</p>
                  <p className="text-xs text-slate-400">15.8 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
