// components/Draggables/Timer.jsx
'use client';

import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (seconds < 59) {
        setSeconds(seconds + 1);
      } else {
        setMinutes(minutes + 1);
        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup the interval on component unmount
  }, [seconds, minutes]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center">
        <div className="text-gray-900 text-6xl font-bold tracking-wider bg-gradient-to-r from-blue-400 via-green-400 to-teal-300 text-transparent bg-clip-text mb-4">
          {`${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`}
        </div>
        <div className="text-sm text-gray-600 uppercase tracking-widest">הזמן שעבר עד כה</div>
      </div>
    </div>
  );
};

export default Timer;
