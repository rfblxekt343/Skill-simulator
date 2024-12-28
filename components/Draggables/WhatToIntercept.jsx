import React, { useState } from 'react';
import DraggableScreen from '../Tests/DraggableScreen';

const WhatToIntercept = () => {
  return (
    <DraggableScreen id="6" initialPosition={{ x: 20, y: 170 }}>
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
        <div className="flex flex-col items-center gap-2 mb-3">
          <svg 
            className="w-6 h-6 text-yellow-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg font-bold text-yellow-800 text-center">
            !חשוב לשים לב
          </h2>
        </div>
        <p className="text-yellow-700 text-center">
          לטילים מותר ליפול רק בשטחים פתוחים ולא בערים מרכזיות.
          נא ודאו שאתם מיירטים את כל הטילים שמכוונים לערים
        </p>
      </div>
    </DraggableScreen>
  );
};

export default WhatToIntercept;