'use client'; // Important for client components

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DraggableScreen from '../Tests/DraggableScreen';
import { incrementStockUI, decrementStockUI } from '../../store/missileStockSlice'; // Adjust the path if necessary

const MissileStock = () => {
  const dispatch = useDispatch();
  const stockUI = useSelector((state) => state.missileStock.stockUI); // Access the stockUI state
  const actualStock = useSelector((state) => state.missileStock.actualStock); // Access the actualStock state

  // useEffect hook to log "good job" if stockUI equals actualStock
  useEffect(() => {
    if (stockUI === actualStock) {
      console.log('good job');
    }
  }, [stockUI, actualStock]); // This hook will run every time stockUI or actualStock changes

  return (
    <DraggableScreen id="1" initialPosition={{ x: 20, y: 20 }}>
      <div className="p-4 bg-white shadow-md rounded-lg max-w-xs w-full text-center border border-gray-200">
        <h1 className="text-xl font-bold mb-3 text-gray-800">
          ניהול מלאי טילים
        </h1>
        <p className="text-gray-600 mb-3 text-sm">
          כאן תצפו במלאי הטילים שלכם, ותעדכנו אותו בהתאם
        </p>
        <p className="text-md font-medium text-gray-700 mb-4">
          כמות הטילים במלאי:{' '}
          <span className="text-green-600 font-bold text-lg">
            {stockUI}
          </span>
        </p>

        {/* Plus and Minus Buttons */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => dispatch(incrementStockUI())}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            +
          </button>
          <button
            onClick={() => dispatch(decrementStockUI())}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            -
          </button>
        </div>
      </div>
    </DraggableScreen>
  );
};

export default MissileStock;
