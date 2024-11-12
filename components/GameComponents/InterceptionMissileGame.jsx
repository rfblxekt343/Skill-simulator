import React, { useState, useEffect, useRef } from 'react';
import { FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setInterceptionMode } from '../../store/game/interceptionGameSlice';

const InterceptionMissileGame = () => {
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interceptionGame.isInterceptionMode);
  const isLaunching = isInterceptionMode;
  const audioRefStart = useRef(null);
  const audioRefStop = useRef(null);

  useEffect(() => {
    // Initialize audio without waiting for it to load
    audioRefStart.current = new Audio('/sounds/chooseMissile.wav');
    audioRefStop.current = new Audio('/sounds/stopped-intercept.wav');

    // Optional: Preload audio
    const preloadAudio = () => {
      audioRefStart.current.load();
      audioRefStop.current.load();
    };

    // Try to preload on component mount
    preloadAudio();

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

  const handleClick = () => {
    // Toggle the interception mode
    dispatch(setInterceptionMode(!isInterceptionMode));

    // Try to play sound, but don't block if it fails
    try {
      if (!isLaunching) {
        audioRefStart.current?.play().catch(() => {
          // Silently handle audio play failure
        });
      } else {
        audioRefStop.current?.play().catch(() => {
          // Silently handle audio play failure
        });
      }
    } catch (error) {
      // Ignore audio errors
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-pressed={isLaunching}
      initial={{ scale: 1 }}
      animate={{ scale: isLaunching ? 1.1 : 1 }}
      transition={{ type: 'spring', stiffness: 500 }}
      className={`flex items-center justify-center px-6 py-4 rounded-full 
        ${isLaunching ? 'bg-red-400 hover:bg-red-500' : 'bg-green-500 hover:bg-green-600'}
        shadow-lg hover:shadow-xl active:shadow-inner text-xl font-bold
        ${isLaunching ? 'text-gray-200' : 'text-white'}`}
      style={{
        fontFamily: "'Rubik', sans-serif",
        boxShadow: isLaunching
          ? '0 8px 15px rgba(255, 0, 0, 0.5)'
          : '0 8px 15px rgba(0, 255, 0, 0.5)',
        minWidth: isLaunching ? '200px' : '150px',
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