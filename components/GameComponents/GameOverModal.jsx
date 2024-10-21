'use client';

import React from 'react';
import { useSelector } from 'react-redux';

import { Trophy, Target, Package } from 'lucide-react';

const calculateScore = (intercepted, missed) => {
  const interceptionScore = intercepted * 10;
  const missedPenalty = missed * 5;
  return interceptionScore - missedPenalty;
};
const GameOverModal = ({ isVisible }) => {
 
const stock = useSelector((state) => state.missileStockGame.stock);
const intercepted = useSelector((state) => state.missileStockGame.intercepted);
const missed = useSelector((state) => state.missileStockGame.missed);

const grade = calculateScore(intercepted, missed); // Calculate the score
  

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white/95 backdrop-blur shadow-2xl rounded-2xl w-full max-w-md mx-auto text-right">
        {/* Header Section */}
        <div className="p-6 text-center border-b">
          <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
          <h2 className="text-3xl font-bold text-blue-700">!המשחק הסתיים</h2>
        </div>

        {/* Stats Section */}
        <div className="p-6 space-y-4">
          {/* Grade */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-1">ציון סופי</p>
            <p className="text-5xl font-bold text-blue-600">{grade}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Target className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">טילים שיורטו</p>
              <p className="text-xl font-bold text-blue-600">{intercepted}/{stock}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">טילים במלאי</p>
              <p className="text-xl font-bold text-blue-600">{stock}</p>
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="p-6 pt-0">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg 
                     font-bold text-lg shadow-md hover:from-blue-700 hover:to-blue-800 
                     transform hover:scale-105 transition-all duration-200"
          >
            חזור לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;