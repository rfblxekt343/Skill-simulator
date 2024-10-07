import React from 'react';
import DraggableScreen from '../Tests/DraggableScreen';

const CitiesList = () => {
  const canDropCities = ['אילת', 'טבריה', 'ירושלים','תל אביב'];
  const cannotDropCities = ['חיפה', 'צפת', 'אשדוד'];

  return (
    <DraggableScreen id="6" initialPosition={{ x: 20, y: 170 }}>

      <div className="dropdown mb-4">
        <details>
          <summary className="btn m-1 flex justify-between items-center">
            <span className="ml-2">▼</span>
            ערים בהן טילים יכולים ליפול
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {canDropCities.map((city, index) => (
              <li key={index}><a>{city}</a></li>
            ))}
          </ul>
        </details>
      </div>

      {/* Dropdown for cities where missiles cannot drop */}
      <div className="dropdown">
        <details>
          <summary className="btn m-1 flex justify-between items-center">
            <span className="ml-2">▼</span>
            ערים בהן טילים לא יכולים ליפול
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {cannotDropCities.map((city, index) => (
              <li key={index}><a>{city}</a></li>
            ))}
          </ul>
        </details>
      </div>
    </DraggableScreen>
  );
};

export default CitiesList;
