'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapGame = dynamic(() => import('../../../components/GameComponents/MapGame'), {
  ssr: false
});
const TimerGame = dynamic(() => import('../../../components/GameComponents/TimerGame'), {
  ssr: false
});
const LaunchMissile = dynamic(() => import('../../../components/GameComponents/InterceptionMissileGame'), {
  ssr: false
});
const MissileStockGame = dynamic(() => import('../../../components/GameComponents/MissileStockGame'), {
  ssr: false
});
const MissileDetailsGame = dynamic(() => import('../../../components/GameComponents/MissileDetailsGame'), {
  ssr: false
});
const GameOverModal = dynamic(() => import('../../../components/GameComponents/GameOverModal'), {
  ssr: false
});

const Game = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTimerEnd = () => {
    setShowModal(true);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/EmptyBackground.PNG')",
      }}
    >
      {/* Map Background - Full screen with padding for UI elements */}
      <div className="absolute inset-0 z-0">
        <MapGame />
      </div>

      {/* Top Bar - Flexible container for Timer and Missile Stock */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start">
        {/* Timer */}
        <div className="flex-shrink-0">
          <TimerGame onTimerEnd={handleTimerEnd} />
        </div>

        {/* Missile Stock */}
        <div className="flex-shrink-0 -mt-1">
          <MissileStockGame />
        </div>
      </div>

      {/* Bottom UI Container - Responsive positioning */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col md:flex-row justify-between items-end gap-4">
        {/* Missile Details - Adjusts width based on screen size */}
        <div className="w-full md:w-auto md:max-w-xs">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 transform transition-all duration-300 hover:scale-105">
            <MissileDetailsGame />
          </div>
        </div>

        {/* Launch Button - Centered on mobile, right-aligned on desktop */}
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <LaunchMissile />
        </div>
      </div>

      {/* Game Over Modal - Centered with responsive padding */}
      <GameOverModal
        isVisible={showModal}
        className="mx-auto max-w-lg w-full px-4 sm:px-0"
      />
    </div>
  );
};

export default Game;