import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../../store/slices/courseSlice';
import { VideoPlayer } from '../../components/features/VideoPlayer';
import { LessonList } from '../../components/features/LessonList';
import { studentApi } from '../../api';

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

  // Ensure modules have lessons and select first one if needed
  useEffect(() => {
    if (modules && modules.length > 0 && !activeLesson) {
      // Find the first lesson in the first module that has lessons
      const firstModuleWithLessons = modules.find(m => m.lessons && m.lessons.length > 0);
      if (firstModuleWithLessons) {
        setActiveLesson(firstModuleWithLessons.lessons[0]);
      }
    }
  }, [modules, activeLesson]);

  // Fetch full lesson details (including signed video URL) when activeLessonId changes
  useEffect(() => {
    const loadLessonDetails = async () => {
      // Fetch if videoUrl is missing or if we just selected from list (which might have old data)
      if (activeLesson?.id) {
        try {
          const res = await studentApi.getLessons(activeLesson.id);
          if (res.data) {
            // Merge existing activeLesson info with new details (specifically videoUrl)
            // If res.data.lesson exists use it, else use res.data
            const details = res.data.lesson || res.data;
            setActiveLesson(prev => ({ ...prev, ...details }));
          }
        } catch (err) {
          console.error("Failed to load lesson details", err);
        }
      }
    };

    // Only fetch if we have an ID and we haven't already fetched the signed URL (simplistic check)
    // Or just always fetch to ensure freshness
    if (activeLesson?.id && !activeLesson.videoUrl?.includes('X-Amz-Signature')) {
      loadLessonDetails();
    }
  }, [activeLesson?.id]);

  const handleProgress = (currentTime, duration) => {
    // Log progress every 10 seconds
    if (Math.floor(currentTime) > 0 && Math.floor(currentTime) % 10 === 0) {
      // Log watch progress
      studentApi.logWatch({
        lessonId: activeLesson.id,
        watchedSec: Math.floor(currentTime),
      }).catch(err => console.error("Error logging watch:", err));
    }
  };

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
  };

  if (!currentCourse || !activeLesson) {
    if (modules && modules.length > 0 && !activeLesson) {
      return <div className="p-8 text-center">Course has no content yet.</div>;
    }
    return <div className="p-8 text-center">Loading player...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <VideoPlayer
          // Prepend S3 domain if it's a relative key (filename)
          url={activeLesson.videoUrl?.startsWith('http')
            ? activeLesson.videoUrl
            : `https://proedge-lms.s3.ap-south-1.amazonaws.com/${activeLesson.videoUrl}`}
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
          modules={modules || []}
          activeLessonId={activeLesson.id}
          onLessonSelect={handleLessonSelect}
        />
      </div>
    </div>
  );
};
