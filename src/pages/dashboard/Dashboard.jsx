import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../../store/slices/courseSlice';
import { CourseCard } from '../../components/features/CourseCard';
import { Card } from '../../components/ui/Card';
import { BookOpen, Clock, Award } from 'lucide-react';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { enrolled, loading } = useSelector(state => state.courses);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  const stats = [
    { label: 'Enrolled Courses', value: enrolled.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hours Learned', value: '12.5', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Certificates', value: '0', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Continue Learning</h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolled.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
