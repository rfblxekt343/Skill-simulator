"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import "leaflet-ant-path";
import { useDispatch, useSelector } from 'react-redux';
import { setChosenMissile } from '../store/chosenMissileSlice';
import { addInterceptedMissile } from '../store/interceptionSlice';
import { setInterceptionMode } from '../store/interceptionSlice';



const LOCATIONS = {
  israelCenter: { lat: 31.7683, lng: 35.2137 },
  telAviv: { lat: 32.0853, lng: 34.7818 },
  haifa: { lat: 32.7940, lng: 34.9896 },
  sea: { lat: 32.0, lng: 33.0 },
  jordan: { lat: 32.0667, lng: 35.9333 },
  lebanon: { lat: 33.8547, lng: 35.8623 },

  jerusalem: { lat: 31.7683, lng: 35.2137 },
  gaza: { lat: 31.5, lng: 34.45 }
};

const MISSILE_TARGETS = [
  // Cities
  { lat: 32.0853, lng: 34.7818, type: 'city' }, // Tel Aviv
  { lat: 31.7683, lng: 35.2137, type: 'city' }, // Jerusalem
  { lat: 32.7940, lng: 34.9896, type: 'city' }, // Haifa
  { lat: 31.8162, lng: 34.9512, type: 'city' }, // Beit Shemesh
  { lat: 31.2516, lng: 34.7915, type: 'city' }, // Beer Sheva
  
  // Open spaces
  { lat: 31.0461, lng: 34.8516, type: 'open' },
  { lat: 31.8928, lng: 34.8113, type: 'open' },
  { lat: 32.3275, lng: 34.8519, type: 'open' },
  { lat: 31.5234, lng: 34.9124, type: 'open' },
  { lat: 32.1234, lng: 34.9876, type: 'open' }
];


const MissilePath = ({ mapInstance, startPosition, endPosition, animate, delay = 0, missileId, speed, classification }) => {
 
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interception.isInterceptionMode);
  const chosenMissile = useSelector((state) => state.chosenMissile.chosenMissile);

  const pathRef = useRef(null);
  const missileRef = useRef(null);
  const interceptorRef = useRef(null);
  const explosionMarkerRef = useRef(null);
  const explosionLayerRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  //const explosionSoundRef = useRef(new Audio('/sounds/Explosion.mp3'));
  const currentPositionRef = useRef(startPosition);
  const animationFrameRef = useRef(null);


  const calculateBearing = (start, end) => {
    const startLat = start.lat * Math.PI / 180;
    const startLng = start.lng * Math.PI / 180;
    const endLat = end.lat * Math.PI / 180;
    const endLng = end.lng * Math.PI / 180;

    const dLng = endLng - startLng;

    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360
    return bearing;
  };


  // Create missile icons for selected and unselected states
  const createMissileIcon = (isSelected, bearing) => {
    return L.divIcon({
      html: `<div style="
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        ${isSelected ? 'background-color: rgba(239, 68, 68, 0.2);' : ''}
        border-radius: 50%;
        border: ${isSelected ? '2px solid #ef4444' : 'none'};
        transform: rotate(${bearing}deg);
      ">
        <img 
          src="/missile-icon.svg" 
          style="
            width: 100%; 
            height: 100%;
            transform-origin: center;
          "
        />
      </div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  useEffect(() => {
  if (missileRef.current) {
    const isSelected = chosenMissile?.id === missileId;

    // Recalculate bearing for the current position
    const bearing = calculateBearing(currentPositionRef.current, endPosition);

    // Update the missile icon with the selection state and bearing
    missileRef.current.setIcon(createMissileIcon(isSelected, bearing));
  }
}, [chosenMissile, missileId, endPosition]);


  useEffect(() => {
    if (!mapInstance || !animate || !isActive) return;

    
    const initialBearing = calculateBearing(startPosition, endPosition);
  

    const path = L.polyline.antPath([startPosition, endPosition], {
      color: "green",
      weight: 3,
    });
    pathRef.current = path;
    path.addTo(mapInstance);

    const missile = L.marker(startPosition, { icon: createMissileIcon(false,initialBearing) });
    missileRef.current = missile;
    missile.addTo(mapInstance);

    missile.on('click', () => {
      dispatch(setChosenMissile({
        id: missileId,
        startPosition,
        endPosition,
        speed: `${speed} קמ"ש`,
        classification,
        startTime: startTime
      }));
    });

    const startTime = Date.now();
    const duration = 200000 * (10 / speed);

    const animateMissile = () => {
      if (!isActive) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
      const lng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;


      // Calculate angle for missile rotation
      const dx = endPosition.lng - startPosition.lng;
      const dy = endPosition.lat - startPosition.lat;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      const newPosition = { lat, lng };
      currentPositionRef.current = newPosition;
      missile.setLatLng(newPosition);

       //const bearing = calculateBearing(startPosition, endPosition);
      //missile.setIcon(createMissileIcon(chosenMissile?.id === missileId, bearing));


      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateMissile);
      } else {
        if (missileRef.current) {
          mapInstance.removeLayer(missileRef.current);
          missileRef.current = null; // Clear the reference
        } if (pathRef.current) {
          mapInstance.removeLayer(pathRef.current);
          pathRef.current = null; // Clear the reference
        }
        setIsActive(false); // Mark the missile as inactive

      }
    };

    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animateMissile);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pathRef.current) mapInstance.removeLayer(pathRef.current);
      if (missileRef.current) mapInstance.removeLayer(missileRef.current);
      if (interceptorRef.current) mapInstance.removeLayer(interceptorRef.current);
      if (explosionMarkerRef.current) mapInstance.removeLayer(explosionMarkerRef.current);
      if (explosionLayerRef.current) mapInstance.removeLayer(explosionLayerRef.current);
    };
  }, [mapInstance, animate, startPosition, endPosition, delay, speed, classification, dispatch, isActive]);

  // Update missile icon when selection changes
  useEffect(() => {
    if (missileRef.current) {
      const isSelected = chosenMissile?.id === missileId;
      missileRef.current.setIcon(createMissileIcon(isSelected));
    }
  }, [chosenMissile, missileId]);

  const createExplosion = (position) => {
    const explosionLayer = L.layerGroup().addTo(mapInstance);
    explosionLayerRef.current = explosionLayer;

    const innerCircle = L.circle(position, {
      color: '#f97316',
      fillColor: '#f97316',
      fillOpacity: 0.8,
      radius: 0,
      weight: 2
    }).addTo(explosionLayer);

    const outerCircle = L.circle(position, {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.6,
      radius: 0,
      weight: 2
    }).addTo(explosionLayer);

    let startTime = Date.now();
    const duration = 1000;
    const maxRadius = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const innerRadius = maxRadius * progress * 0.7;
      const outerRadius = maxRadius * progress;

      innerCircle.setRadius(innerRadius);
      outerCircle.setRadius(outerRadius);

      innerCircle.setStyle({
        fillOpacity: 0.8 * (1 - progress),
        opacity: 0.8 * (1 - progress)
      });

      outerCircle.setStyle({
        fillOpacity: 0.6 * (1 - progress),
        opacity: 0.6 * (1 - progress)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (explosionLayerRef.current) {
            mapInstance.removeLayer(explosionLayerRef.current);
          }
       
      }
    };

    animate();
  };

  useEffect(() => {
    if (isInterceptionMode && chosenMissile?.id === missileId && isActive) {
      const interceptorStartPosition = mapInstance.getCenter();
      const missilePosition = currentPositionRef.current;

      const interceptorIcon = L.icon({
        iconUrl: '/interception-missile-icon.svg',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const interceptor = L.marker(interceptorStartPosition, { icon: interceptorIcon });
      interceptorRef.current = interceptor;
      interceptor.addTo(mapInstance);

      const interceptorDuration = 1000;
      const startTime = Date.now();
      let interceptorFrame;

      const timeFraction = interceptorDuration / (200000 * (10 / speed));
      const predictedMissilePosition = {
        lat: missilePosition.lat + (endPosition.lat - missilePosition.lat) * timeFraction,
        lng: missilePosition.lng + (endPosition.lng - missilePosition.lng) * timeFraction
      };

      const animateInterceptor = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / interceptorDuration, 1);

        const lat = interceptorStartPosition.lat + (predictedMissilePosition.lat - interceptorStartPosition.lat) * progress;
        const lng = interceptorStartPosition.lng + (predictedMissilePosition.lng - interceptorStartPosition.lng) * progress;

        interceptor.setLatLng([lat, lng]);

        if (progress < 1) {
          interceptorFrame = requestAnimationFrame(animateInterceptor);
        } else {
          //explosionSoundRef.current.play();
          createExplosion(predictedMissilePosition);
          setIsActive(false);
          dispatch(addInterceptedMissile(missileId));

          setTimeout(() => {
            if (pathRef.current) mapInstance.removeLayer(pathRef.current);
            if (missileRef.current) mapInstance.removeLayer(missileRef.current);
            if (interceptorRef.current) mapInstance.removeLayer(interceptorRef.current);
            dispatch(setInterceptionMode(false));
          }, 1000);
        }
      };

      animateInterceptor();

      return () => {
        if (interceptorFrame) {
          cancelAnimationFrame(interceptorFrame);
        }
      };
    }
  }, [isInterceptionMode, chosenMissile, missileId, mapInstance, dispatch, isActive, startPosition, endPosition, speed]);

  return null;
};

const Map = () => {
  const missileIdRef = useRef(0); // Initialize missileIdRef here, before useState
  const [missiles, setMissiles] = useState([]); // Start with an empty array for missiles
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: '100%', height: '75vh' });

  const updateMapDimensions = useCallback(() => {
    // Get viewport dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // Calculate dimensions based on screen size
    let width = '100%';
    let height = '75vh';

    // Mobile (portrait)
    if (vw < 768) {
      height = '60vh';
    }
    // Mobile (landscape)
    else if (vh < 500) {
      height = '85vh';
    }
    // Tablet
    else if (vw < 1024) {
      height = '70vh';
    }
    // Desktop
    else {
      height = '75vh';
    }

    setMapDimensions({ width, height });
  }, []);

  useEffect(() => {
    // Initial update
    updateMapDimensions();

    // Add resize listener
    window.addEventListener('resize', updateMapDimensions);

    return () => {
      window.removeEventListener('resize', updateMapDimensions);
    };
  }, [updateMapDimensions]);

  const generateMissileSource = useCallback(() => {
    const sources = [LOCATIONS.lebanon, LOCATIONS.jordan, LOCATIONS.sea, LOCATIONS.gaza];
    return sources[Math.floor(Math.random() * sources.length)];
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const L = require('leaflet');
    require('leaflet-ant-path');

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(LOCATIONS.israelCenter, 8);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let missileCount = 1; // Start at 1 since initial missile is already added
    const maxMissiles = 8;


    const interval = setInterval(() => {
      if (missileCount >= maxMissiles) {
        clearInterval(interval);
        return;
      }

      setMissiles(prev => {
        const target = MISSILE_TARGETS[Math.floor(Math.random() * MISSILE_TARGETS.length)];
        return [...prev, {
          id: `missile-${missileIdRef.current++}`,
          startPosition: generateMissileSource(),
          endPosition: target,
          speed: Math.round(Math.random() * (50 - 40) + 40),
          classification: target.type,
          startTime: Date.now()
        }];
      });

      missileCount++;
    }, 3000);

    return () => clearInterval(interval);
  }, [generateMissileSource]);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <div 
        className="w-full max-w-screen-xl mt-4 md:mt-8 lg:mt-12"
        style={{ width: mapDimensions.width }}
      >
        <div 
          ref={mapRef} 
          className="rounded-lg shadow-lg"
          style={{ height: mapDimensions.height }}
        />
        {mapInstanceRef.current && missiles.map(missile => (
          <MissilePath
            key={missile.id}
            mapInstance={mapInstanceRef.current}
            missileId={missile.id}
            startPosition={missile.startPosition}
            endPosition={missile.endPosition}
            animate={true}
            speed={missile.speed}
            classification={missile.classification}
          />
        ))}
      </div>
    </div>
  );
};

export default Map;




