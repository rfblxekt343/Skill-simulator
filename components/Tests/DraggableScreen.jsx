// components/DraggableScreen.jsx
'use client';

import React from 'react';
import Draggable from 'react-draggable';

const DraggableScreen = ({ id, children }) => {
  // Event handlers
  const handleStart = (e, data) => {
    console.log(`Drag started for ${id}`);
  };

  const handleDrag = (e, data) => {
    console.log(`Dragging ${id}`, data);
  };

  const handleStop = (e, data) => {
    console.log(`Drag stopped for ${id}`, data);
  };

  return (
    <Draggable
      axis="both"
      defaultPosition={{ x: 0, y: 0 }}
      position={null}
      grid={[25, 25]}
      scale={1}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div className="p-4 border border-gray-300 bg-blue-100 rounded-lg shadow-md flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl cursor-move">
        {/* Make the whole component draggable */}
        <div className="cursor-pointer bg-gray-200 p-2 rounded-md mb-2 w-full text-center">
          Drag handle {id}
        </div>
        <div className="flex-1 text-center">{children}</div>
      </div>
    </Draggable>
  );
};

export default DraggableScreen;
