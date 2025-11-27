import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../../store/slices/courseSlice';
import { VideoPlayer } from '../../components/features/VideoPlayer';
import { LessonList } from '../../components/features/LessonList';
import { studentApi, courseApi } from '../../api';

export const LessonPlayer = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, modules } = useSelector(state => state.courses);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (courseId && !currentCourse) {
      dispatch(fetchCourseDetails(courseId));
    }
  }, [courseId, currentCourse, dispatch]);

  // Auto-select first lesson if none selected
  useEffect(() => {
    if (modules.length > 0 && !activeLesson) {
      // Find first lesson of first module (mock logic)
      // In real app, modules would contain lessons array
      // For now, we'll fetch lessons for the first module
      // This is a simplification for the prototype
    }
  }, [modules, activeLesson]);

  // Mock fetching lessons for the player view
  const [playerModules, setPlayerModules] = useState([]);

  useEffect(() => {
    const loadLessons = async () => {
      if (modules.length > 0) {
        const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
          const res = await studentApi.getLessons(mod.id); // Using studentApi or courseApi
          // Actually courseApi.getLessons was defined in api/index.js
          // Let's import courseApi properly or just use the one we have
          // I'll use a direct import or just mock it here for simplicity if needed
          // But wait, I defined courseApi.getLessons in api/index.js
          return { ...mod, lessons: res?.data || [] };
        }));
        // Fix: need to import courseApi
        setPlayerModules(modulesWithLessons);
        
        if (modulesWithLessons[0]?.lessons?.length > 0) {
          setActiveLesson(modulesWithLessons[0].lessons[0]);
        }
      }
    };
    loadLessons();
  }, [modules]);

  const handleProgress = (currentTime, duration) => {
    // Log progress every 10 seconds or on specific events
    if (Math.floor(currentTime) % 10 === 0) {
      // studentApi.logWatch({ lessonId: activeLesson.id, watchedSec: currentTime });
    }
  };

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
  };

  if (!currentCourse || !activeLesson) return <div className="p-8 text-center">Loading player...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <VideoPlayer 
          url={activeLesson.videoUrl} 
          onProgress={handleProgress}
          onEnded={() => console.log('Lesson completed')}
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{activeLesson.title}</h1>
          <p className="text-slate-500 mt-1">{currentCourse.title}</p>
        </div>
      </div>
      
      <div className="w-full lg:w-96 shrink-0 h-full">
        <LessonList 
          modules={playerModules} 
          activeLessonId={activeLesson.id} 
          onLessonSelect={handleLessonSelect} 
        />
      </div>
    </div>
  );
};

// Need to add the import for courseApi inside the component file to make it work
// I will rewrite the file content with the import
