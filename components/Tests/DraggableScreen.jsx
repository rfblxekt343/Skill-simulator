import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

const DraggableScreen = ({ id, children, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const draggableRef = useRef(null);  // Reference to the draggable element

  // Handle window resize event
  useEffect(() => {
    const handleResize = () => {
      if (draggableRef.current) {
        const draggableNode = draggableRef.current; // Directly use the ref for the DOM node
        const { offsetWidth, offsetHeight } = draggableNode;
        const { innerWidth, innerHeight } = window;

        let newX = position.x;
        let newY = position.y;

        // Adjust if draggable element goes out of bounds horizontally
        if (newX + offsetWidth > innerWidth) {
          newX = innerWidth - offsetWidth;
        }
        if (newX < 0) {
          newX = 0;
        }

        // Adjust if draggable element goes out of bounds vertically
        if (newY + offsetHeight > innerHeight) {
          newY = innerHeight - offsetHeight;
        }
        if (newY < 0) {
          newY = 0;
        }

        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  // Event handlers
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div
        ref={draggableRef}  // Attach the ref directly to the draggable div
        className="absolute p-2 border border-gray-300 bg-white bg-opacity-90 rounded-lg shadow-md flex flex-col items-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 pointer-events-auto z-10"
      
      >
       <div className="flex-1 text-center">{children}</div>
      </div>
    </Draggable>
  );
};

export default DraggableScreen;
