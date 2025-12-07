import React from 'react';
import { PlayCircle, CheckCircle, Lock, Circle } from 'lucide-react';
import { cn } from '../ui/Button';

export const LessonList = ({ modules, activeLessonId, onLessonSelect, lessonProgress = {} }) => {
  // Format duration from seconds to "X min" or "X sec"
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return 'N/A';
    if (seconds < 60) return `${seconds} sec`;
    return `${Math.floor(seconds / 60)} min`;
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId) => {
    return lessonProgress[lessonId]?.completed || false;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800">Course Content</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-4">
        {modules.map((module) => (
          <div key={module.id}>
            <h4 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">
              {module.title}
            </h4>
            <div className="space-y-1">
              {module.lessons?.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                const isCompleted = isLessonCompleted(lesson.id) || lesson.completed;
                const isLocked = false; // Add logic if needed

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonSelect(lesson)}
                    disabled={isLocked}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all",
                      isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600",
                      isLocked && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "shrink-0",
                      isActive ? "text-indigo-600" : isCompleted ? "text-emerald-500" : "text-slate-400"
                    )}>
                      {isCompleted ? <CheckCircle size={18} /> : isActive ? <PlayCircle size={18} /> : <Circle size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", isActive && "font-bold")}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDuration(lesson.durationSec || lesson.duration)}
                      </p>
                    </div>
                    {isCompleted && (
                      <span className="text-xs text-emerald-500 font-medium">Done</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
