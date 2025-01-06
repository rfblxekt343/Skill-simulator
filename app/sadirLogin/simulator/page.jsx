'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import MissileStock from '../../../components/Draggables/MissileStock';
import MissileDetails from '../../../components/Draggables/MissileDetails';
//import InterceptionMissile from '../../components/Draggables/InterceptionMissile';
//import Classification from '../../components/Draggables/Classification';
//import ReportInterception from '../../components/Draggables/ReportInterception';
import WhatToIntercept from '../../../components/Draggables/WhatToIntercept';
//import Timer from '../../components/Timer';
import Modal from '../../../components/Modal';
import VoiceMessage from '../../../components/VoiceMessage';
import DoneSimulator from '../../../components/DoneSimulator';

const Map = dynamic(() => import('../../../components/Map'), {
  ssr: false,
});

const SimulatorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const reportInterception = useSelector(state => state.reportInterception.reportInterception);
  const interceptedCount = useSelector(state => state.howManyIntercepted.howManyIntercepted);
  const activeMissilesCount = useSelector(state => state.howManyIntercepted.activeMissilesCount);
  const isStarted = useSelector(state => state.howManyIntercepted.isStarted);

  
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
   console.log(activeMissilesCount,isStarted)
    // Show done modal when either condition is met
    if (interceptedCount === 5 ||  (activeMissilesCount === 0 && isStarted ) ) {
      setShowDone(true);
    }
  }, [interceptedCount,activeMissilesCount,isStarted]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/EmptyBackground.PNG')" }}
    >
      <WhatToIntercept />
      <MissileStock />
      <MissileDetails />

      <div className="absolute inset-0 z-0">
        <Map/>
      </div>

      <VoiceMessage isVisible={reportInterception} duration={2000} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
      <DoneSimulator isOpen={showDone} />
    </div>
  );
};
export default SimulatorPage;
