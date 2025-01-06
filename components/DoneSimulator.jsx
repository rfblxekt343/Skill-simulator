import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Medal, Rocket, RotateCcw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {resetAllHowMany} from '../store/howManyInterceptedSlice';
import {resetAllChosen} from '../store/chosenMissileSlice';
import {resetAllInterception} from '../store/interceptionSlice';
import { useRouter } from 'next/navigation';

const DoneSimulator = ({ isOpen }) => {
  const dispatch = useDispatch();
  const [showAnimation, setShowAnimation] = useState(false);
  const interceptedCount = useSelector((state) => state.howManyIntercepted.howManyIntercepted);
  const router = useRouter(); 

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const calculateGrade = (count) => {
    if (count >= 5) return 'א';
    if (count >= 4) return 'ב';
    if (count >= 3) return 'ג';
    if (count >= 2) return 'ד';
    return 'נכשל';
  };

  const getGradeColor = (grade) => {
    const colors = {
      'א': 'text-green-500',
      'ב': 'text-blue-500',
      'ג': 'text-yellow-500',
      'ד': 'text-orange-500',
      'נכשל': 'text-red-500'
    };
    return colors[grade] || 'text-gray-500';
  };

  const onTryAgain = () => {
      dispatch(resetAllHowMany());
      dispatch(resetAllChosen());
      dispatch(resetAllInterception());
      router.push('/');
     
  }

  if (!isOpen) return null;

  const grade = calculateGrade(interceptedCount);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" dir="rtl">
      <div
        className={`bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl transform transition-all duration-500 
          ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="flex justify-center mb-6">
          <Medal className="w-16 h-16 text-blue-500" />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          הסימולציה הושלמה
        </h2>

        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
            <Rocket className="h-5 w-5" />
            <h3 className="font-semibold">טילים שיורטו בהצלחה</h3>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            {interceptedCount}
          </p>
        </div>

        {/* <div className={`text-7xl font-bold mb-8 ${getGradeColor(grade)} transition-all duration-300 hover:scale-110`}>
          ציון: {grade}
        </div> */}

        <button
          onClick={onTryAgain}
          className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
            text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105
            flex items-center justify-center gap-3 w-full"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
          נסה שוב
        </button>
      </div>
    </div>
  );
};

export default DoneSimulator;