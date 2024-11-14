'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import MissileStock from '../../components/Draggables/MissileStock';
import MissileDetails from '../../components/Draggables/MissileDetails';
import InterceptionMissile from '../../components/Draggables/InterceptionMissile';
import Classification from '../../components/Draggables/Classification';
import ReportInterception from '../../components/Draggables/ReportInterception';
import CitiesList from '../../components/Draggables/CitiesList';
import Timer from '../../components/Timer';
import Modal from '../../components/Modal';
import VoiceMessage from '../../components/VoiceMessage';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
});

const SimulatorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reportInterception = useSelector(state => state.reportInterception.reportInterception);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/EmptyBackground.PNG')" }}
    >
      {/* Draggable Components */}
      <MissileStock />
      <MissileDetails />
      <InterceptionMissile />
      <Classification />
      <ReportInterception />
      <CitiesList />

      {/* Timer */}
      <div className="absolute top-2 right-4 z-20 pointer-events-auto">
        <Timer initialMinutes={5} initialSeconds={0} />
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <Map />
      </div>

      {/* Voice Message */}
      <VoiceMessage isVisible={reportInterception} duration={2000} />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default SimulatorPage;
