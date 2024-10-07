import React, { useEffect, useState } from 'react';

const VoiceMessage = ({ isVisible,duration }) => {
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowGif(true);
      const timer = setTimeout(() => {
        setShowGif(false); // Hide the video after the specified duration
      }, duration);
      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [isVisible, duration]);

  if (!showGif) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg relative z-50 max-w-lg mx-auto">
        
        <video
          src="/voiceMessage.mp4"
          autoPlay
          loop
          muted
          className="w-full h-auto rounded-lg object-contain"
        />
        {/* Close button (optional) */}
       
      </div>
    </div>
  );
};

export default VoiceMessage;
