"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import L from 'leaflet';


// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const position = { lat: 31.0461, lng: 34.8516 };
const telAvivPosition = { lat: 32.0853, lng: 34.7818 };
const milesToMeters = miles => miles * 1609.34;

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const InterceptorManagement = ({userId}) => {
  const [miles, setMiles] = useState(1);
  const [markerPosition, setMarkerPosition] = useState(position);
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  const handleDrop = (e) => {
    setMarkerPosition(e.latlng);
  };

  const handleMapClick = useCallback((e) => {
    if (isAddingMarker) {
      const newMarker = {
        position: e.latlng,
      };
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      setIsAddingMarker(false);
    }
  }, [isAddingMarker]);

  const handleShowGrade = async () => {
    if (!userId) {
      alert('User ID is not available.');
      return;
    }

    const grade = 100; // Example grade
    const res = await fetch('/api/save-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, grade }),
    });

    if (res.ok) {
      alert('Grade saved successfully!');
    } else {
      alert('Error saving grade');
    }
  };


  useEffect(() => {
    const resizeMap = () => {
      window.dispatchEvent(new Event('resize'));
    };
    resizeMap();
    window.addEventListener('resize', resizeMap);
    return () => window.removeEventListener('resize', resizeMap);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full h-96 md:w-4/5 lg:w-3/4">
        <MapContainer
          center={position}
          zoom={8}
          className="h-full rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: miles }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Circle
              center={markerPosition}
              color="#50a882"
              fillColor="#61ce9e"
              radius={milesToMeters(miles)}
            >
              <Popup>
                <span>Somewhere in the circle!</span>
              </Popup>
            </Circle>
          </motion.div>

          <Marker position={markerPosition} draggable={true} eventHandlers={{ dragend: handleDrop }}>
            <Popup>
              <span>You are here!</span>
            </Popup>
          </Marker>

          <Marker position={telAvivPosition}>
            <Popup>
              <span>Fixed location in Tel Aviv</span>
            </Popup>
          </Marker>

          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position}>
              <Popup>
                <span>Dynamic marker {index + 1}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="w-full md:w-3/4 mt-6 flex flex-col items-center">
        <label htmlFor="mileRange" className="font-semibold text-gray-700 mb-2">
          Circle Radius: {miles} {miles === 1 ? 'mile' : 'miles'}
        </label>
        <input
          onChange={e => setMiles(e.target.value)}
          id="mileRange"
          type="range"
          min={0.25}
          max={5}
          step={0.25}
          value={miles}
          className="w-full md:w-1/2"
        />
        
        <button
          onClick={() => setIsAddingMarker(true)}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition"
        >
          Add Marker (Click on the map)
        </button>

        {isAddingMarker && (
          <p className="text-blue-500 font-medium mt-2">Click on the map to add a new marker</p>
        )}

        <p className="mt-2 text-gray-700">
          Marker count: {markers.length}
        </p>


        <button onClick={handleShowGrade} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition">הצג ציון</button>
      </div>
    </div>
  );
};

export default InterceptorManagement;



