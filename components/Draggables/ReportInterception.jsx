import React, { useCallback } from 'react';
import DraggableScreen from '../Tests/DraggableScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setReportInterception } from '../../store/reportInterceptionSlice';

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

const ReportInterception = () => {
  const dispatch = useDispatch();
  const reportInterception = useSelector(state => state.reportInterception.reportInterception);

  const handleReportClick = useCallback(() => {
    dispatch(setReportInterception(!reportInterception));
  }, [dispatch, reportInterception]);

  return (
    <DraggableScreen id="5" initialPosition={{ x: 20, y: 140 }}>
      <div className="p-4 bg-white shadow-md rounded-lg max-w-xs w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          דיווח יירוט
        </h2>
        <button 
          {...useMultipleEvents(handleReportClick)}
          className={`
            w-full px-6 py-3
            rounded-lg text-white font-semibold
            transition-all duration-200
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              !reportInterception 
                ? 'bg-green-500 active:bg-green-700 focus:ring-green-400' 
                : 'bg-red-500 active:bg-red-700 focus:ring-red-400'
            }
          `}
        >
          {reportInterception ? 'הפסק דיווח' : 'דווח על יירוט'}
        </button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          חובה לדווח לפני יירוט
        </p>
      </div>
    </DraggableScreen>
  );
};

export default ReportInterception;