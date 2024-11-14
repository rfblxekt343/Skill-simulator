'use client';

import React, { useState, useEffect } from 'react';

const Timer = ({ onTimerEnd }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds < 59) {
          return prevSeconds + 1;
        } else {
          setMinutes((prevMinutes) => prevMinutes + 1);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup on component unmount
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full p-2">
      <div className="text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-lg shadow-lg">
        <div className="text-4xl font-bold text-white tracking-wide mb-4">
          {/* Timer Display */}
          <span className="countdown font-mono">
            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </span>
        </div>

        <div className="text-sm text-gray-400 uppercase tracking-wider mt-2">
          הזמן שעבר עד כה
        </div>

        {/* Stylish border glow */}
        <div className="border-t border-gray-700 mt-2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Timer;
