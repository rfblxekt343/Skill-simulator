import React from 'react';
import { useSelector } from 'react-redux';

const MissileStockGame = () => {
  const stock = useSelector((state) => state.missileStockGame.stock);

  return (
    <div className="flex flex-col sm:flex-row items-center text-white rounded-lg">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-0 sm:mr-2">
        <img
          src="/launcher.png"
          alt="Missile Launcher"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center sm:text-left">
        מלאי טילים: <span className="text-cyan-100">{stock}</span>
      </h2>
    </div>
  );
};

export default MissileStockGame;