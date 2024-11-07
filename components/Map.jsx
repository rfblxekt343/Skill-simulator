"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-ant-path";
import { useDispatch, useSelector } from 'react-redux';
import { setChosenMissile } from '../store/chosenMissileSlice';
import { addInterceptedMissile } from '../store/interceptionSlice';
import {decrementActualStock} from '../store/missileStockSlice';


// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const israelCenter = { lat: 31.7683, lng: 35.2137 };
const position = { lat: 31.0461, lng: 34.8516 };
const telAvivPosition = { lat: 32.0853, lng: 34.7818 };
const haifaPosition = { lat: 32.7940, lng: 34.9896 }; // New constant for Haifa
const seaPosition = { lat: 32.0, lng: 33.0 };
const jordanPosition = { lat: 32.0667, lng: 35.9333 };
const lebanonPosition = { lat: 33.8547, lng: 35.8623 }; // Beirut, Lebanon
const jerusalemPosition = { lat: 31.7683, lng: 35.2137 };


const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const MissilePath = ({ startPosition, endPosition, animate, delay = 0, missileId, speed, classification }) => {
  const map = useMap();
  const missileRef = useRef(null);
  const pathRef = useRef(null);
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interception.isInterceptionMode);
  const isInterceptionModeRef = useRef(isInterceptionMode); // Create a ref to store the interception mode
  const reportInterception = useSelector(state => state.reportInterception.reportInterception);
  const reportInterceptionRef = useRef(reportInterception);
  const audioRef = useRef(new Audio('/sounds/missile-intercepted.wav'));

  useEffect(() => {
    // Store ref in a variable to avoid cleanup issues
    const audio = audioRef.current;
    
    // Clean up the audio object on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset the audio to start
      }
    };
  }, []);
  // Update the ref when the state changes
  useEffect(() => {
    isInterceptionModeRef.current = isInterceptionMode;
  }, [isInterceptionMode]);

  useEffect(() => {
    reportInterceptionRef.current = reportInterception;
  }, [reportInterception]);

  useEffect(() => {
    let animationTimer;
    if (animate) {
      animationTimer = setTimeout(() => {
        // Determine color based on classification
        let color;
        if (classification === "טיל אדום") {
          color = "#ef4444";
        } else if (classification === "טיל ירוק") {
          color = "#10b981";
        } else if (classification === "טיל צהוב") {
          color = "#f59e0b";
        }

        // Create the path
        const path = L.polyline.antPath([startPosition, endPosition], {
          color: color,
          weight: 3,
        });
        pathRef.current = path;
        path.addTo(map);

        // Create custom missile icon
        const missileIcon = L.icon({
          iconUrl: '/missile-icon.svg',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        // Create marker with custom icon
        const missile = L.marker(startPosition, { icon: missileIcon });
        missileRef.current = missile;

        // Add the missile to the map
        missile.addTo(map);

        // Attach click event to the missile to show details
        missile.on('click', () => {
          if (isInterceptionModeRef.current) {
            if (!reportInterceptionRef.current) {
              alert('לא ניתן להפעיל טיל כאשר לא דווח על ירי טיל');
              return;
            }
            audioRef.current.play();
            dispatch(addInterceptedMissile(missileId));
            map.removeLayer(missile);
            map.removeLayer(path);
            dispatch(decrementActualStock());
          } else {
            dispatch(setChosenMissile({
              id: missileId,
              startPosition,
              endPosition,
              speed: `${speed} קמ"ש`,
              classification: classification,
            }));
          }
        });

        // Animate the missile
        const animateMissile = () => {
          const durationInMs = 120000 * (10 / speed);

          const startTime = Date.now();

          const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / durationInMs, 1);

            const lat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
            const lng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;

            missile.setLatLng([lat, lng]);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        };

        animateMissile();
      }, delay);
    }

    return () => {
      clearTimeout(animationTimer);
      if (pathRef.current && map.hasLayer(pathRef.current)) {
        map.removeLayer(pathRef.current);
      }
      if (missileRef.current && map.hasLayer(missileRef.current)) {
        map.removeLayer(missileRef.current);
      }
    };
  }, [animate, map, startPosition, endPosition, delay, dispatch, missileId, speed]);

  return null;
};



const Map = () => {

  const [miles, setMiles] = useState(1);
  const milesToMeters = (miles) => (miles * 1609.34).toFixed(2);
  const [markerPosition, setMarkerPosition] = useState(position);
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [missileLaunched, setMissileLaunched] = useState(true);


  const handleDrop = (e) => {
    setMarkerPosition(e.latlng);
  };

  const handleMapClick = useCallback((e) => {
    if (isAddingMarker) {
      const newMarker = {
        position: e.latlng,
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setIsAddingMarker(false);
    }
  }, [isAddingMarker]);

  return (
    <div className="flex flex-col items-center p-4  min-h-screen">
      <div className="w-full h-[75vh] md:w-[90vw] lg:w-[85vw] max-w-screen-xl mt-12">
        <MapContainer
          center={israelCenter}
          zoom={8}
          className="h-full rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />

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

          <Marker position={markerPosition} draggable={true} eventHandlers={{ dragend: handleDrop }}>
            <Popup>
              <span>You are here!</span>
            </Popup>
          </Marker>

          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position}>
              <Popup>
                <span>Dynamic marker {index + 1}</span>
              </Popup>
            </Marker>
          ))}

          {/* Missile paths with click event handling */}
          <MissilePath
            missileId="1"
            startPosition={seaPosition}
            endPosition={telAvivPosition}
            animate={missileLaunched}
            speed={10}
            classification="טיל אדום"
          />

          <MissilePath
            missileId="2"
            startPosition={jordanPosition}
            endPosition={haifaPosition}
            animate={missileLaunched}
            delay={3000}
            speed={20}
            classification="טיל ירוק"
          />
          <MissilePath
            missileId="3"
            startPosition={lebanonPosition}
            endPosition={jerusalemPosition}
            animate={missileLaunched}
            delay={6000}
            speed={15}
            classification="טיל צהוב"
          />

        </MapContainer>
      </div>

      <div className="absolute bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg flex flex-col items-center">
        <label htmlFor="mileRange" className="font-semibold text-gray-700 mb-2 text-right" dir="rtl">
          מרחק הרדיוס מן הנ.צ שלי: {milesToMeters(miles)} מטרים
        </label>

        <input
          onChange={(e) => setMiles(e.target.value)}
          id="mileRange"
          type="range"
          min={0.25}
          max={5}
          step={0.25}
          value={miles}
          className="w-48"
        />
      </div>

    </div>
  );
};

export default Map;





























