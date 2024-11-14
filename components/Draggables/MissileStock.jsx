'use client';

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DraggableScreen from '../Tests/DraggableScreen';
import { incrementStockUI, decrementStockUI } from '../../store/missileStockSlice';

// Utility function for handling both click and touch events
const useMultipleEvents = (handler) => {
  return {
    onClick: handler,
    onTouchEnd: (e) => {
      e.preventDefault(); // Prevent ghost clicks
      handler(e);
    },
  };
};

const MissileStock = () => {
  const dispatch = useDispatch();
  const stockUI = useSelector((state) => state.missileStock.stockUI);
  const actualStock = useSelector((state) => state.missileStock.actualStock);

  useEffect(() => {
    if (stockUI === actualStock) {
      console.log('good job');
    }
  }, [stockUI, actualStock]);

  const handleIncrement = useCallback(() => {
    dispatch(incrementStockUI());
  }, [dispatch]);

  const handleDecrement = useCallback(() => {
    dispatch(decrementStockUI());
  }, [dispatch]);

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

        <div className="flex justify-center gap-4">
          <button
            {...useMultipleEvents(handleIncrement)}
            className="
              min-w-[44px] min-h-[44px]
              px-3 py-1.5
              bg-green-500 text-white
              rounded-md shadow-sm
              text-lg font-bold
              transition-all duration-200
              active:bg-green-700
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-green-400
            "
            aria-label="הוסף טיל"
          >
            +
          </button>
          <button
            {...useMultipleEvents(handleDecrement)}
            className="
              min-w-[44px] min-h-[44px]
              px-3 py-1.5
              bg-red-500 text-white
              rounded-md shadow-sm
              text-lg font-bold
              transition-all duration-200
              active:bg-red-700
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-red-400
            "
            aria-label="הורד טיל"
          >
            -
          </button>
        </div>
      </div>
    </DraggableScreen>
  );
};

export default MissileStock;