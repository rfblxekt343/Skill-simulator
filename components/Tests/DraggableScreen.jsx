import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

const DraggableScreen = ({ id, children, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const draggableRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (draggableRef.current) {
        const draggableNode = draggableRef.current;
        const { offsetWidth, offsetHeight } = draggableNode;
        const { innerWidth, innerHeight } = window;

        let newX = position.x;
        let newY = position.y;

        if (newX + offsetWidth > innerWidth) {
          newX = innerWidth - offsetWidth;
        }
        if (newX < 0) {
          newX = 0;
        }

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

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable position={position} onDrag={handleDrag} bounds="parent">
      <div
        ref={draggableRef}
        className="absolute p-2 border border-gray-300 bg-white bg-opacity-90 rounded-lg shadow-md flex flex-col items-center 
          w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 pointer-events-auto z-10"
      >
        <div className="flex-1 text-center">
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableScreen;
