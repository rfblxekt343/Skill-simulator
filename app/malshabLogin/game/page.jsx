"use client";
import React from 'react';
import MapGame from '../../../components/GameComponents/MapGame';
import TimerGame from '../../../components/GameComponents/TimerGame';
import LaunchMissile from '../../../components/GameComponents/InterceptionMissileGame';
import MissileStockGame from '../../../components/GameComponents/MissileStockGame'; 
import MissileDetailsGame from '../../../components/GameComponents/MissileDetailsGame';

const Game = () => {
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
                <TimerGame />
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
        </div>
    );
};

export default Game;
