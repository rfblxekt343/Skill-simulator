
"use client"

import React, { useState, useEffect } from 'react';

const Game = () => {
  const [inventory, setInventory] = useState(5); // Initial interceptors
  const [threats, setThreats] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Simulate incoming threats
    const interval = setInterval(() => {
      if (threats.length < 5) {
        setThreats((prev) => [
          ...prev,
          { id: Date.now(), type: 'missile', active: true }
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [threats]);

  const handleLaunchInterceptor = (threatId) => {
    if (inventory > 0) {
      setInventory((prev) => prev - 1);
      setThreats((prev) =>
        prev.map((threat) =>
          threat.id === threatId ? { ...threat, active: false } : threat
        )
      );
      setScore((prev) => prev + 10);
    }
  };

  return (
    <div className="air-defense-simulation">
      <h1>סימולציה להגנה אווירית</h1>
      <p>מלאי מיירטים: {inventory}</p>
      <p>ניקוד: {score}</p>
      <div className="threats">
        {threats.map((threat) => (
          <div
            key={threat.id}
            className={`threat ${threat.active ? 'bg-red-200' : 'bg-green-200'}`}
            onClick={() => handleLaunchInterceptor(threat.id)}
            style={{
              padding: '10px',
              margin: '10px',
              cursor: inventory > 0 && threat.active ? 'pointer' : 'not-allowed'
            }}
          >
            {threat.active ? `איום ${threat.id} - פעיל` : `איום ${threat.id} - נוטרל`}
          </div>
        ))}
      </div>
      {inventory === 0 && threats.some((threat) => threat.active) && (
        <p>אין מיירטים שנותרו! חלק מהאוימים עדיין פעילים!</p>
      )}
    </div>
  );
};

export default Game;
