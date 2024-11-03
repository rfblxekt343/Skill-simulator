import React from 'react';
import { useSelector } from 'react-redux';

const MissileStockGame = () => {
  const stock = useSelector((state) => state.missileStockGame.stock);

  return (
    <div className="flex flex-col sm:flex-row items-center text-white rounded-lg bg-black/30 backdrop-blur-sm p-2">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-1 sm:mb-0 sm:mr-2">
        <img
          src="/launcher.png"
          alt="Missile Launcher"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center sm:text-left">
        מלאי טילים: <span className="text-cyan-100">{stock}</span>
      </h2>
    </div>
  );
};

export default MissileStockGame;