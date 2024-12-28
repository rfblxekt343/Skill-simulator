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

  // Create missile icons for selected and unselected states
  const createMissileIcon = (isSelected) => {
    return L.divIcon({
      html: `<div style="
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: ${isSelected ? '2px solid #ef4444' : 'none'};
        padding: 2px;
      ">
        <img src="/missile-icon.svg" style="width: 100%; height: 100%;" />
      </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  useEffect(() => {
    if (!mapInstance || !animate || !isActive) return;

    // const color = {
    //   'city': '#ef4444',
    //   'open space': '#10b981'
    // }[classification] || '#f59e0b';

    const path = L.polyline.antPath([startPosition, endPosition], {
      color: "green",
      weight: 3,
    });
    pathRef.current = path;
    path.addTo(mapInstance);

    const missile = L.marker(startPosition, { icon: createMissileIcon(false) });
    missileRef.current = missile;
    missile.addTo(mapInstance);

    missile.on('click', () => {
      dispatch(setChosenMissile({
        id: missileId,
        startPosition,
        endPosition,
        speed: `${speed} קמ"ש`,
        classification,
      }));
    });

    const startTime = Date.now();
    const duration = 70000 * (10 / speed);

    const animateMissile = () => {
      if (!isActive) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
      const lng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;

      const newPosition = { lat, lng };
      currentPositionRef.current = newPosition;
      missile.setLatLng(newPosition);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateMissile);
      }else{
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
        setTimeout(() => {
          if (explosionLayerRef.current) {
            mapInstance.removeLayer(explosionLayerRef.current);
          }
        }, 100);
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

      const timeFraction = interceptorDuration / (70000 * (10 / speed));
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
  const [missiles, setMissiles] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const missileIdRef = useRef(0);

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
    let missileCount = 0;
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
          classification: target.type
        }];
      });

      missileCount++;
    }, 2000);

    return () => clearInterval(interval);
  }, [generateMissileSource]);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <div className="w-full h-[75vh] md:w-[90vw] lg:w-[85vw] max-w-screen-xl mt-12">
        <div ref={mapRef} className="h-full w-full rounded-lg shadow-lg" />
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