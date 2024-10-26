"use client";

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

    const handleTimerEnd = () => {
        setShowModal(true);
    }
    return (
        <div
            className="relative w-full h-screen overflow-hidden"
            style={{
                backgroundImage: "url('/EmptyBackground.PNG')", // Path to your image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <MapGame />
            </div>

            {/* Timer at the top-right */}
            <div className="absolute top-2 right-4 z-20 pointer-events-auto">
                <TimerGame onTimerEnd={handleTimerEnd} />
            </div>

            {/* Missile Stock Display in the top-left */}
            <div className="absolute top-2 left-1 z-20 pointer-events-auto">
                <MissileStockGame />
            </div>

            {/* Positioning LaunchMissile button in the bottom right corner */}
            <div className="absolute bottom-14 right-10 z-20">
                <LaunchMissile />
            </div>

            {/* Missile Details Game Component */}
            <div className="absolute bottom-10 left-4 z-20 bg-white bg-opacity-80 rounded-lg shadow-lg p-4 max-w-xs">
                <MissileDetailsGame />
            </div>
            <GameOverModal
                isVisible={showModal}
                
            />
        </div>
    );
};

export default Game;
