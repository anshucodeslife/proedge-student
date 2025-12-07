import React from 'react';
import { useSelector } from 'react-redux';
import { CourseCard } from '../../components/features/CourseCard';
import { BookOpen } from 'lucide-react';

export const EnrolledCourses = () => {
  const { enrolledCourses, loading } = useSelector(state => state.courses);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
        <p className="text-slate-500">Continue where you left off</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading courses...</div>
      ) : enrolledCourses && enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No courses enrolled yet</h3>
          <p className="text-slate-500 max-w-sm">
            It looks like you haven't enrolled in any courses. Check out the available courses to start learning!
          </p>
        </div>
      )}
    </div>
  );
};
