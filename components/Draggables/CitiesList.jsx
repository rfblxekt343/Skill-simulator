import React, { useState } from 'react';
import DraggableScreen from '../Tests/DraggableScreen';

const CitiesList = () => {
  const [dropDownStates, setDropDownStates] = useState({
    canDrop: false,
    cannotDrop: false
  });

  const canDropCities = ['אילת', 'טבריה', 'ירושלים', 'תל אביב'];
  const cannotDropCities = ['חיפה', 'צפת', 'אשדוד'];

  const handleToggle = (dropdownName) => {
    setDropDownStates(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const renderDropdown = (title, cities, dropdownName) => (
    <div className="dropdown mb-4">
      <button 
        className="btn m-1 w-full flex justify-between items-center"
        onClick={() => handleToggle(dropdownName)}
        onTouchEnd={(e) => {
          e.preventDefault(); // Prevent ghost clicks
          handleToggle(dropdownName);
        }}
        type="button"
      >
        <span className="ml-2">
          {dropDownStates[dropdownName] ? '▲' : '▼'}
        </span>
        {title}
      </button>
      {dropDownStates[dropdownName] && (
        <ul className="menu bg-base-100 rounded-box w-full p-2 shadow mt-1">
          {cities.map((city, index) => (
            <li key={index}>
              <button 
                className="w-full text-right px-4 py-2 hover:bg-base-200 rounded-lg"
                onClick={() => {}} // Add your click handler if needed
                onTouchEnd={(e) => {
                  e.preventDefault();
                  // Add your touch handler if needed
                }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <DraggableScreen id="6" initialPosition={{ x: 20, y: 170 }}>
      <div className="w-full max-w-sm">
        {renderDropdown(
          'ערים בהן טילים יכולים ליפול',
          canDropCities,
          'canDrop'
        )}
        {renderDropdown(
          'ערים בהן טילים לא יכולים ליפול',
          cannotDropCities,
          'cannotDrop'
        )}
      </div>
    </DraggableScreen>
  );
};

export default CitiesList;