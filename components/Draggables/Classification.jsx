import React from 'react';
import DraggableScreen from '../Tests/DraggableScreen';

const Classification = () => {
  return (
    <DraggableScreen id="6" initialPosition={{ x: 20, y: 110 }}>
      <div className="p-2 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-right" dir="rtl">מקרא סיווג</h2>
        <ul className="space-y-1 text-right" dir="rtl">
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2"></span> {/* Reduced size and margin */}
            <span className="text-sm">אדום - טיל מסוכן</span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full ml-2"></span> {/* Reduced size and margin */}
            <span className="text-sm">ירוק - טיל לא מסוכן</span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full ml-2"></span> {/* Reduced size and margin */}
            <span className="text-sm">צהוב - טיל לא מסוכן</span>
          </li>
        </ul>
      </div>
    </DraggableScreen>
  );
};

export default Classification;
