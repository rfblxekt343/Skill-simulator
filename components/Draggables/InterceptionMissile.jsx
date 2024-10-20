
import React, {  useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DraggableScreen from '../Tests/DraggableScreen';
import { setInterceptionMode } from '../../store/interceptionSlice';

const InterceptionMissile = () => {
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interception.isInterceptionMode);
  const isLaunching = isInterceptionMode;
  const audioRefStart = useRef(null);
  const audioRefStop = useRef(null);

  useEffect(() => {
    // Initialize the audio
    audioRefStart.current = new Audio('/sounds/בחר-טיל-לשיגור.wav'); // Adjust the path if needed
    audioRefStop.current = new Audio('/sounds/שיגור-הופסק.wav'); // Adjust the path if needed
  }, []);


  const handleInterceptionClick = () => {
    dispatch(setInterceptionMode(!isInterceptionMode));

    if (!isLaunching) {
      audioRefStart.current.play();
      //dispatch(decrementStock());
    }else{
      audioRefStop.current.play();
    }
  };
  

  return (
    <DraggableScreen id="3" initialPosition={{ x: 20, y: 80 }}>
      <div className="bg-white p-3 rounded-lg shadow-md">
        <h1 className="text-lg font-bold mb-2 text-center">יירוט טילים</h1>
        <button
          onClick={handleInterceptionClick}
          className={`w-full py-2 px-4 rounded ${
            isInterceptionMode ? 'bg-rose-400 hover:bg-rose-500 text-white' : 'bg-teal-300 hover:bg-teal-400 text-white'
          }`}
        >
          {isInterceptionMode ? 'ביטול מצב יירוט' : 'הפעלת מצב יירוט'}
        </button>
        {isInterceptionMode && (
          <p className="mt-2 text-sm text-gray-600 text-center">לחץ על טיל במפה כדי ליירט אותו</p>
        )}
      </div>
    </DraggableScreen>
  );
};
export default InterceptionMissile;