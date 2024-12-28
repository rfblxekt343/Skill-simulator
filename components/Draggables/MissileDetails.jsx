import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrementActualStock } from '../../store/missileStockSlice';
import { setInterceptionMode, addInterceptedMissile } from '../../store/interceptionSlice';
import DraggableScreen from '../Tests/DraggableScreen';

const MissileDetails = () => {
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interception.isInterceptionMode);
  const chosenMissile = useSelector((state) => state.chosenMissile.chosenMissile);
  const [timeLeft, setTimeLeft] = useState(null);
  const [canIntercept, setCanIntercept] = useState(true);

  const getLocationName = (position) => {
    if (position.lat === 32.0 && position.lng === 33.0) return "הים התיכון";
    if (position.lat === 32.0853 && position.lng === 34.7818) return "תל אביב";
    if (position.lat === 32.0667 && position.lng === 35.9333) return "ירדן";
    if (position.lat === 32.7940 && position.lng === 34.9896) return "חיפה";
    if (position.lat === 33.8547 && position.lng === 35.8623) return "לבנון";
    if (position.lat === 31.7683 && position.lng === 35.2137) return "ירושלים";
    if (position.lat === 31.5 && position.lng === 34.45) return "עזה";
    return "מיקום לא ידוע";
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const lat1 = point1.lat * Math.PI / 180;
    const lat2 = point2.lat * Math.PI / 180;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    if (chosenMissile) {
      setCanIntercept(true); // Reset interception state for new missile
      setTimeLeft(null); // Reset timer
    }
  }, [chosenMissile?.id]);

  useEffect(() => {
    if (!chosenMissile) return;
    
    // Ensure speed is a valid number
    const speed = parseFloat(chosenMissile.speed.replace(/[^0-9.]/g, ''));
    
    if (isNaN(speed)) {
      console.error('Invalid speed value:', chosenMissile.speed);
      return;
    }

    // Calculate total flight time based on the animation duration
    const totalFlightTime = Math.floor((70000 * (10 / speed)) / 1000); // Convert to seconds
    const startTime = Date.now();
    
    console.log('Debug info:', {
      speed,
      totalFlightTime,
      startTime,
      chosenMissile
    });

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, totalFlightTime - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setCanIntercept(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [chosenMissile]);

  const handleInterception = () => {
    if (chosenMissile && canIntercept) {
      dispatch(setInterceptionMode(!isInterceptionMode));
      dispatch(addInterceptedMissile(chosenMissile.id));
      dispatch(decrementActualStock());
    }
  };

  return (
    <DraggableScreen id="2" initialPosition={{ x: 20, y: 50 }}>
      <div className="bg-white p-3 rounded-lg shadow-md max-w-xs w-full border border-gray-200">
        <h2 className="text-lg font-bold mb-2 text-center text-blue-600 border-b border-blue-200 pb-1">
          פרטים על הטיל שנבחר
        </h2>
        {chosenMissile ? (
          <div className="space-y-1 text-sm">
            <DetailItem
              icon="🏁"
              label="שוגר מ"
              value={getLocationName(chosenMissile.startPosition)}
            />
            <DetailItem
              icon="🎯"
              label="יעד"
              value={getLocationName(chosenMissile.endPosition)}
            />
            <DetailItem
              icon="⚡"
              label="מהירות"
              value={chosenMissile.speed ? `${chosenMissile.speed} קמ"ש` : 'לא ידוע'}
            />
            {timeLeft !== null && (
              <DetailItem
                icon="⏱️"
                label="זמן ליירוט"
                value={`${timeLeft} שניות`}
              />
            )}

            {chosenMissile.classification === "city" && (
              <p className="text-red-600 text-sm mt-2 font-bold text-center">
                מטרה נופלת בשטח עירוני צריך ליירט
              </p>
            )}
            {chosenMissile.classification === "open space" && (
              <p className="text-green-600 text-sm mt-2 font-bold text-center">
                מטרה נופלת בשטח פתוח לא צריך ליירט
              </p>
            )}
            
            <div className="mt-3 pt-2 border-t border-gray-200">
              <button
                onClick={handleInterception}
                disabled={!canIntercept}
                className={`w-full font-bold py-2 px-4 rounded transition-colors duration-200 ${
                  canIntercept 
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                יירט טיל
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center text-sm">
            על מנת לראות פרטים על טיל, יש ללחוץ על אחד מן הטילים במפה
          </p>
        )}
      </div>
    </DraggableScreen>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-1 w-full">
    <span className="flex items-center justify-end w-full font-medium text-gray-600 text-right">
      <span className="mr-2">{icon}</span>
      <span className="whitespace-nowrap">{label}: {value}</span>
    </span>
  </div>
);

export default MissileDetails;