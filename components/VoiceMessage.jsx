import React, { useEffect, useState } from 'react';

const VoiceMessage = ({ isVisible, duration }) => {
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowGif(true);
      const timer = setTimeout(() => {
        setShowGif(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!showGif) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-xs md:max-w-md mx-auto">
        <video
          src="/voiceMessage.mp4"
          autoPlay
          loop
          muted
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default VoiceMessage;
