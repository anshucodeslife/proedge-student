import React, { useRef, useEffect } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { Loader2 } from 'lucide-react';

export const VideoPlayer = ({ url, poster, onProgress, onEnded }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Optional: Add event listeners for more granular tracking if needed
    const video = playerRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (onProgress) {
        onProgress(video.currentTime, video.duration);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onProgress]);

  if (!url) {
    return (
      <div className="aspect-video bg-slate-900 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-2" size={32} />
          <p>Loading Video Source...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <ReactHlsPlayer
        playerRef={playerRef}
        src={url}
        autoPlay={false}
        controls={true}
        width="100%"
        height="100%"
        poster={poster}
        onEnded={onEnded}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
