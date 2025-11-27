import React from 'react';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
          <Clock size={12} />
          <span>{course.totalLessons} Lessons</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1">
            {course.description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => navigate(`/courses/${course.id}`)}
            icon={course.progress > 0 ? PlayCircle : BookOpen}
          >
            {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
