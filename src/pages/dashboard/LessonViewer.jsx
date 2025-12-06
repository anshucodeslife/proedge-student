import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, CheckCircle } from 'lucide-react';
import { fetchLessonDetails, fetchCourseModules } from '../../store/slices/courseSlice';

export const LessonViewer = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentLesson, currentModules, loading } = useSelector(state => state.courses);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = React.useRef(null);

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchLessonDetails(lessonId));
    }
    if (courseId && currentModules.length === 0) {
      dispatch(fetchCourseModules(courseId));
    }
  }, [lessonId, courseId, dispatch]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const findNextLesson = () => {
    if (!currentModules || !currentLesson) return null;
    
    let foundCurrent = false;
    for (const module of currentModules) {
      for (const lesson of module.lessons || []) {
        if (foundCurrent) return lesson;
        if (lesson.id === currentLesson.id) foundCurrent = true;
      }
    }
    return null;
  };

  const nextLesson = findNextLesson();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="relative group">
          <video
            ref={videoRef}
            src={currentLesson.videoUrl}
            className="w-full aspect-video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
          
          {/* Play Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={togglePlay}
          >
            <button className="bg-white bg-opacity-20 p-6 rounded-full backdrop-blur-sm hover:bg-opacity-30 transition-all">
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" />
              ) : (
                <Play className="w-12 h-12 text-white" />
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Progress Bar */}
            <div 
              className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="hover:text-blue-400">
                  {isPlaying ? <Pause /> : <Play />}
                </button>
                <button onClick={toggleMute} className="hover:text-blue-400">
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </button>
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <button onClick={toggleFullscreen} className="hover:text-blue-400">
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentLesson.title}
        </h1>
        {currentLesson.description && (
          <p className="text-gray-600 mb-4">{currentLesson.description}</p>
        )}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Duration: {formatTime(currentLesson.durationSec || duration)}</span>
          {currentLesson.order && <span>Lesson {currentLesson.order}</span>}
        </div>
      </div>

      {/* Next Lesson */}
      {nextLesson && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Next Lesson</p>
              <p className="text-gray-900">{nextLesson.title}</p>
            </div>
            <button
              onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Completed */}
      {progress >= 95 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Lesson completed!</p>
          </div>
        </div>
      )}
    </div>
  );
};
