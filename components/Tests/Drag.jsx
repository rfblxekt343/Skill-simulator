// components/Drag.jsx
'use client';

import React from 'react';
import DraggableScreen from './DraggableScreen';

export default function Drag() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      <DraggableScreen id="1">Content 1</DraggableScreen>
      <DraggableScreen id="2">Content 2</DraggableScreen>
      <DraggableScreen id="3">Content 3</DraggableScreen>
      <DraggableScreen id="4">Content 4</DraggableScreen>
    </div>
  );
}
