'use client';

import React, { useState, useEffect } from 'react';

const Timer = ({onTimerEnd}) => {
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds

  useEffect(() => {
    if (timeLeft <= 0){
      onTimerEnd();
      return;
    }; // Stop if the countdown has reached 0

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease time left by 1 second
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup the interval on component unmount
  }, [timeLeft, onTimerEnd]);

  // Calculate minutes and seconds from timeLeft
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center w-full h-full p-2">
      <div className="text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-lg shadow-lg">
        <div className="text-4xl font-bold text-white tracking-wide mb-4">
          {/* Countdown Timer */}
          <span className="countdown font-mono">
            <span style={{ "--value": minutes.toString().padStart(2, '0') }}></span>:
            <span style={{ "--value": seconds.toString().padStart(2, '0') }}></span>
          </span>
        </div>

        <div className="text-sm text-gray-400 uppercase tracking-wider mt-2">
          הזמן שנותר
        </div>

        {/* Stylish border glow */}
        <div className="border-t border-gray-700 mt-2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Timer;




 

