import React from 'react';
import { useSelector } from 'react-redux';

const MissileDetailsGame = () => {
  const chosenMissile = useSelector((state) => state.chosenMissile.chosenMissile);

  const getLocationName = (position) => {
    const isCloseEnough = (lat1, lng1, lat2, lng2, tolerance = 0.5) => {
      return Math.abs(lat1 - lat2) < tolerance && Math.abs(lng1 - lng2) < tolerance;
    };
  
    // Define all possible locations
    const locations = [
      { lat: 32.0, lng: 33.0, name: "הים התיכון" },
      { lat: 32.0853, lng: 34.7818, name: "תל אביב" },
      { lat: 32.0667, lng: 35.9333, name: "ירדן" },
      { lat: 32.7940, lng: 34.9896, name: "חיפה" },
      { lat: 33.8547, lng: 35.8623, name: "לבנון" },
      { lat: 31.7683, lng: 35.2137, name: "ירושלים" },
      { lat: 31.5, lng: 34.45, name: "עזה" },
      { lat: 31.2543, lng: 34.7915, name: "באר שבע" },
      { lat: 31.2516, lng: 34.7915, name: "אשדוד" },
      { lat: 31.0461, lng: 34.8516, name: "אשקלון" },
      { lat: 32.1877, lng: 34.8697, name: "נתניה" },
      { lat: 32.0167, lng: 34.7500, name: "בת ים" },
      { lat: 31.8928, lng: 34.8113, name: "רמלה" },
      { lat: 32.3275, lng: 34.8519, name: "קיסריה" }
    ];
  
    const foundLocation = locations.find(loc => 
      isCloseEnough(position.lat, position.lng, loc.lat, loc.lng)
    );
  
    return foundLocation ? foundLocation.name : "מיקום לא ידוע";
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md max-w-xs w-full border border-gray-200">
      <h2 className="text-lg font-bold mb-2 text-center text-blue-600 border-b border-blue-200 pb-1">
        פרטים על הטיל שנבחר
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
          <DetailItem icon="📡" label="סוג" value={chosenMissile.classification} />
          
          {/* Conditional message for "טיל אדום" classification */}
          {chosenMissile.classification === "טיל אדום" && (
            <p className="text-red-600 text-sm mt-2 font-bold text-center">
              מטרה שצריך לשגר
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-sm">
          על מנת לראות פרטים על טיל, יש ללחוץ על אחד מן הטילים במפה
        </p>
      )}
    </div>
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

export default MissileDetailsGame;
