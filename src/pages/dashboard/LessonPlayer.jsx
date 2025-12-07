import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails, fetchCourseModules, fetchCourseProgress } from '../../store/slices/courseSlice';
import { VideoPlayer } from '../../components/features/VideoPlayer';
import { LessonList } from '../../components/features/LessonList';
import { studentApi } from '../../api';

export const LessonPlayer = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, currentModules, progress } = useSelector(state => state.courses);
  const [activeLesson, setActiveLesson] = useState(null);
  const [savedProgress, setSavedProgress] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const lastSavedTime = useRef(0);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetails(courseId));
      dispatch(fetchCourseModules(courseId));
      dispatch(fetchCourseProgress(courseId));
    }
  }, [courseId, dispatch]);

  // Build lesson progress map from Redux state
  useEffect(() => {
    const courseProgress = progress[courseId];
    if (courseProgress?.lessons) {
      const progressMap = {};
      courseProgress.lessons.forEach(lesson => {
        progressMap[lesson.id] = {
          completed: lesson.completed,
          watchedSec: lesson.watchedSec,
          percentage: lesson.percentage
        };
      });
      setLessonProgress(progressMap);
    }
  }, [progress, courseId]);

  // Ensure modules have lessons and select first one if needed
  useEffect(() => {
    if (currentModules && currentModules.length > 0 && !activeLesson) {
      const firstModuleWithLessons = currentModules.find(m => m.lessons && m.lessons.length > 0);
      if (firstModuleWithLessons) {
        setActiveLesson(firstModuleWithLessons.lessons[0]);
      }
    }
  }, [currentModules, activeLesson]);

  // Fetch full lesson details when activeLessonId changes
  useEffect(() => {
    const loadLessonDetails = async () => {
      if (activeLesson?.id && !activeLesson.videoUrl) {
        try {
          console.log('Fetching lesson details for ID:', activeLesson.id);
          const res = await studentApi.getLessons(activeLesson.id);
          console.log('API Response:', res);
          if (res.data) {
            const details = res.data.lesson || res.data;
            const progressData = res.data.progress;

            console.log('Video URL:', details.videoUrl);

            if (progressData && progressData.lastPosition > 0) {
              setSavedProgress(progressData);
            } else {
              setSavedProgress(null);
            }

            if (progressData) {
              setLessonProgress(prev => ({
                ...prev,
                [activeLesson.id]: {
                  completed: progressData.completed,
                  watchedSec: progressData.watchedSec,
                  percentage: progressData.percentage
                }
              }));
            }

            // Update lesson with new details including videoUrl
            setActiveLesson(prev => ({ ...prev, ...details }));
            lastSavedTime.current = 0;
          }
        } catch (err) {
          console.error("Failed to load lesson details", err);
        }
      }
    };
    loadLessonDetails();
  }, [activeLesson?.id, activeLesson?.videoUrl]);

  // Save progress function
  const saveProgress = async (currentTime, completed = false) => {
    if (!activeLesson?.id) return;

    try {
      await studentApi.logWatch({
        lessonId: activeLesson.id,
        watchedSec: Math.floor(currentTime),
        lastPosition: Math.floor(currentTime),
        completed
      });
      lastSavedTime.current = Math.floor(currentTime);

      if (completed) {
        setLessonProgress(prev => ({
          ...prev,
          [activeLesson.id]: {
            ...prev[activeLesson.id],
            completed: true
          }
        }));
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const handleProgress = (currentTime, duration) => {
    const currentSec = Math.floor(currentTime);
    if (currentSec > 0 && currentSec - lastSavedTime.current >= 5) {
      saveProgress(currentTime);
    }
  };

  const handleVideoEnded = () => {
    if (activeLesson?.id) {
      saveProgress(activeLesson.durationSec || 0, true);
      dispatch(fetchCourseProgress(courseId));
    }
  };

  const handleLessonSelect = (lesson) => {
    if (activeLesson?.id && lastSavedTime.current > 0) {
      saveProgress(lastSavedTime.current);
    }
    setSavedProgress(null);
    setActiveLesson({ ...lesson, videoUrl: undefined });
  };

  if (!currentCourse || !activeLesson) {
    if (currentModules && currentModules.length > 0 && !activeLesson) {
      return <div className="p-8 text-center">Course has no content yet.</div>;
    }
    return <div className="p-8 text-center">Loading player...</div>;
  }

  const courseProgressData = progress[courseId];
  const overallProgress = courseProgressData?.progressPercentage || 0;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <VideoPlayer
          key={activeLesson.id}
          url={activeLesson.videoUrl?.startsWith('http')
            ? activeLesson.videoUrl
            : `https://proedge-lms.s3.ap-south-1.amazonaws.com/${activeLesson.videoUrl}`}
          onProgress={handleProgress}
          onEnded={handleVideoEnded}
          initialPosition={savedProgress?.lastPosition || 0}
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{activeLesson.title}</h1>
          <p className="text-slate-500 mt-1">{currentCourse.title}</p>
          {savedProgress && savedProgress.lastPosition > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              Resuming from {Math.floor(savedProgress.lastPosition / 60)}:{String(Math.floor(savedProgress.lastPosition % 60)).padStart(2, '0')}
            </p>
          )}
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Course Progress</span>
              <span className="font-medium text-slate-700">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 shrink-0 h-full">
        <LessonList
          modules={currentModules || []}
          activeLessonId={activeLesson.id}
          onLessonSelect={handleLessonSelect}
          lessonProgress={lessonProgress}
        />
      </div>
    </div>
  );
};
