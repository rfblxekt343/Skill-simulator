'use client'; // Important for client components

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DraggableScreen from '../Tests/DraggableScreen';
import { increment, decrement } from '../../store/missileStockSlice'; // Adjust the path if necessary

const MissileStock = () => {
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.missileStock.stock); // Access the stock state

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
            {stock}
          </span>
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => dispatch(increment())}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            הוסף טיל
          </button>
          <button
            onClick={() => dispatch(decrement())}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-all duration-200 transform hover:scale-105 text-sm"
          >
            הורד טיל
          </button>
        </div>
      </div>
    </DraggableScreen>
  );
};

export default MissileStock;
