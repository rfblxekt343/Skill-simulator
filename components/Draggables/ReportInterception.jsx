import React from 'react';
import DraggableScreen from '../Tests/DraggableScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setReportInterception } from '../../store/reportInterceptionSlice';

const ReportInterception = () => {
  const dispatch = useDispatch();
  const reportInterception = useSelector(state => state.reportInterception.reportInterception);

  const handleReportClick = () => {
    dispatch(setReportInterception(!reportInterception));
    // Additional logic can be added here, like a confirmation message or animation
  };

  return (
    <DraggableScreen id="5" initialPosition={{ x: 20, y: 140 }}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        דיווח יירוט
      </h2>
      <button 
        onClick={handleReportClick}
        className={`px-6 py-3 rounded-lg text-white font-semibold focus:outline-none transition duration-300 ${
          !reportInterception ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        } focus:ring-4 focus:ring-blue-300`}
      >
        {reportInterception ? 'הפסק דיווח' : 'דווח על יירוט'}
      </button>
      <p className="mt-4 text-gray-600 text-center">
        חובה לדווח לפני יירוט
      </p>
    </DraggableScreen>
  );
}

export default ReportInterception;
