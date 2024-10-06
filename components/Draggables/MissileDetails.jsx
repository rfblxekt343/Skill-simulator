import React from 'react';
import { useSelector } from 'react-redux';
import DraggableScreen from '../Tests/DraggableScreen';

const MissileDetails = () => {
  const chosenMissile = useSelector((state) => state.chosenMissile.chosenMissile);

  const getLocationName = (position) => {
    if (position.lat === 32.0 && position.lng === 33.0) return "הים התיכון";
    if (position.lat === 32.0853 && position.lng === 34.7818) return "תל אביב";
    if (position.lat === 32.0667 && position.lng === 35.9333) return "ירדן";
    if (position.lat === 32.7940 && position.lng === 34.9896) return "חיפה";
    if (position.lat === 33.8547 && position.lng === 35.8623) return "לבנון";
    if (position.lat === 31.7683 && position.lng === 35.2137) return "ירושלים";
    return "מיקום לא ידוע";
  };

  return (
    <DraggableScreen id="2" initialPosition={{ x: 30, y: 30 }}>
      <div className="bg-white p-3 rounded-lg shadow-md max-w-xs w-full border border-gray-200">
        <h2 className="text-lg font-bold mb-2 text-center text-blue-600 border-b border-blue-200 pb-1">
          פרטי הטיל
        </h2>
        {chosenMissile ? (
          <div className="space-y-1 text-sm">
            <DetailItem icon="🚀" label="טיל מספר" value={chosenMissile.id} />
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
            <DetailItem icon="⚡" label="מהירות" value={chosenMissile.speed} />
          </div>
        ) : (
          <p className="text-gray-600 text-center text-sm">
            בחר טיל במפה לפרטים
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