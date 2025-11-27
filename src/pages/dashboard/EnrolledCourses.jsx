import React from 'react';
import { useSelector } from 'react-redux';
import { CourseCard } from '../../components/features/CourseCard';

export const EnrolledCourses = () => {
  const { enrolled, loading } = useSelector(state => state.courses);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
        <p className="text-slate-500">Continue where you left off</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolled.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
