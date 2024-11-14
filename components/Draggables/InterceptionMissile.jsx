import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DraggableScreen from '../Tests/DraggableScreen';
import { setInterceptionMode } from '../../store/interceptionSlice';

// Utility function for handling both click and touch events
const useMultipleEvents = (handler) => {
  return {
    onClick: handler,
    onTouchEnd: (e) => {
      e.preventDefault(); // Prevent ghost clicks
      handler(e);
    },
  };
};

const InterceptionMissile = () => {
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interception.isInterceptionMode);
  const isLaunching = isInterceptionMode;
  const audioRefStart = useRef(null);
  const audioRefStop = useRef(null);

  useEffect(() => {
    audioRefStart.current = new Audio('/sounds/chooseMissile.wav');
    audioRefStop.current = new Audio('/sounds/stopped-intercept.wav');
    
    // Cleanup function to handle component unmounting
    return () => {
      if (audioRefStart.current) {
        audioRefStart.current.pause();
        audioRefStart.current = null;
      }
      if (audioRefStop.current) {
        audioRefStop.current.pause();
        audioRefStop.current = null;
      }
    };
  }, []);

  const handleInterceptionClick = useCallback(() => {
    dispatch(setInterceptionMode(!isInterceptionMode));
    
    if (!isLaunching) {
      audioRefStart.current?.play().catch(err => {
        console.log('Audio play failed:', err);
        // Continue with the state change even if audio fails
      });
    } else {
      audioRefStop.current?.play().catch(err => {
        console.log('Audio play failed:', err);
        // Continue with the state change even if audio fails
      });
    }
  }, [dispatch, isInterceptionMode, isLaunching]);

  return (
    <DraggableScreen id="3" initialPosition={{ x: 20, y: 80 }}>
      <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-xs">
        <h1 className="text-lg font-bold mb-2 text-center">יירוט טילים</h1>
        <button
          {...useMultipleEvents(handleInterceptionClick)}
          className={`
            w-full py-3 px-4 rounded
            font-medium text-white
            transition-all duration-200
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              isInterceptionMode 
                ? 'bg-rose-400 active:bg-rose-600 focus:ring-rose-500' 
                : 'bg-teal-300 active:bg-teal-500 focus:ring-teal-400'
            }
          `}
        >
          {isInterceptionMode ? 'ביטול מצב יירוט' : 'הפעלת מצב יירוט'}
        </button>
        {isInterceptionMode && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            לחץ על טיל במפה כדי ליירט אותו
          </p>
        )}
      </div>
    </DraggableScreen>
  );
};

export default InterceptionMissile;