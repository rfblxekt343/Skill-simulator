// pages/SimulatorPage.jsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MissileStock from '../../components/Draggables/MissileStock';
import MissileDetails from '../../components/Draggables/MissileDetails';
import InterceptionMissile from '../../components/Draggables/InterceptionMissile';
import Timer from '../../components/Timer';
import Modal from '../../components/Modal'; 

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

const SimulatorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show the modal after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when the user clicks close
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      {/* Draggable screens container */}
      <div className="relative w-full h-full z-10 pointer-events-none">
        <MissileStock />
        <MissileDetails />
        <InterceptionMissile/>

        {/* Timer */}
        <div className="absolute top-2 right-4 z-20 pointer-events-auto">
          <Timer initialMinutes={5} initialSeconds={0} />
        </div>
      </div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default SimulatorPage;
