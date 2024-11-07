import React, { useState, useEffect, useRef } from 'react';
import { FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setInterceptionMode } from '../../store/game/interceptionGameSlice';

const InterceptionMissileGame = () => {
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interceptionGame.isInterceptionMode);
  const isLaunching = isInterceptionMode;
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRefStart = useRef(null);
  const audioRefStop = useRef(null);

  useEffect(() => {
    // Initialize the audio
    audioRefStart.current = new Audio('/sounds/chooseMissile.wav');
    audioRefStop.current = new Audio('/sounds/stopped-intercept.wav');

    // Set up event listeners for when the audio files are loaded
    const handleAudioLoaded = () => {
      if (audioRefStart.current.readyState === 4 && audioRefStop.current.readyState === 4) {
        setAudioLoaded(true);
      }
    };

    audioRefStart.current.addEventListener('canplaythrough', handleAudioLoaded);
    audioRefStop.current.addEventListener('canplaythrough', handleAudioLoaded);

    // Clean up event listeners
    return () => {
      audioRefStart.current.removeEventListener('canplaythrough', handleAudioLoaded);
      audioRefStop.current.removeEventListener('canplaythrough', handleAudioLoaded);
    };
  }, []);

  const handleClick = () => {
    if (!audioLoaded) return; // Don't do anything if audio isn't loaded yet

    // Toggle the interception mode
    dispatch(setInterceptionMode(!isInterceptionMode));

    // Play appropriate sound and update stock
    if (!isLaunching) {
      audioRefStart.current.play();
    } else {
      audioRefStop.current.play();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-pressed={isLaunching}
      disabled={!audioLoaded}
      initial={{ scale: 1 }}
      animate={{ scale: isLaunching ? 1.1 : 1 }}
      transition={{ type: 'spring', stiffness: 500 }}
      className={`flex items-center justify-center px-6 py-4 rounded-full 
        ${isLaunching ? 'bg-red-400 hover:bg-red-500' : 'bg-green-500 hover:bg-green-600'}
        shadow-lg hover:shadow-xl active:shadow-inner text-xl font-bold
        ${isLaunching ? 'text-gray-200' : 'text-white'}
        ${!audioLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        fontFamily: "'Rubik', sans-serif",
        boxShadow: isLaunching
          ? '0 8px 15px rgba(255, 0, 0, 0.5)'
          : '0 8px 15px rgba(0, 255, 0, 0.5)',
        minWidth: isLaunching ? '200px' : '150px', // Adjust width dynamically
      }}
    >
      <FaRocket className="mr-2" size={24} />
      <span className={`whitespace-nowrap ${isLaunching ? 'text-lg' : 'text-xl'}`}>
        {isLaunching ? 'הפסק שיגור' : 'שגר'}
      </span>
    </motion.button>
  );
};

export default InterceptionMissileGame;
