import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import 'leaflet/dist/leaflet.css';
import "leaflet-ant-path";
import { useDispatch, useSelector } from 'react-redux';
import { setChosenMissile } from '../../store/game/chosenMissileGameSlice';
import { addInterceptedMissile } from '../../store/game/interceptionGameSlice';
import { interceptMissile, missMissile } from '../../store/game/missileStockGameSlice';
import { motion, AnimatePresence } from 'framer-motion';

// Constants (same as before)
const israelCenter = { lat: 31.7683, lng: 35.2137 };
const position = { lat: 31.0461, lng: 34.8516 };
const jordanPosition = { lat: 32.0667, lng: 35.9333 };
const lebanonPosition = { lat: 33.8547, lng: 35.8623 };
const jerusalemPosition = { lat: 31.7683, lng: 35.2137 };
const haifaPosition = { lat: 32.7940, lng: 34.9896 };
const seaPosition = { lat: 32.0, lng: 33.0 };
const gazaPosition = { lat: 31.5, lng: 34.45 };

const missileTargets = [
  { lat: 31.2543, lng: 34.7915 }, // Beer Sheva
  { lat: 31.8162, lng: 35.2137 }, // Jerusalem
  { lat: 31.2516, lng: 34.7915 }, // Ashdod
  { lat: 31.0461, lng: 34.8516 }, // Ashkelon
  { lat: 32.1877, lng: 34.8697 }, // Netanya
  { lat: 32.0167, lng: 34.7500 }, // Bat Yam
  { lat: 31.8928, lng: 34.8113 }, // Ramla
  { lat: 32.3275, lng: 34.8519 }, // Caesarea
];

// Memoized MissilePath Component
const MissilePath = memo(({ mapInstance, startPosition, endPosition, animate, delay = 0, missileId, speed, classification }) => {
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interceptionGame.isInterceptionMode);
  const pathRef = useRef(null);
  const missileRef = useRef(null);
  const interceptorRef = useRef(null);
  const [showExplosion, setShowExplosion] = useState(false);
  const audioRef = useRef(new Audio('/sounds/missile-intercepted.wav'));
  const explosionSoundRef = useRef(new Audio('/sounds/Explosion.mp3'));

  useEffect(() => {
    if (!mapInstance) return;

    let timeoutId;

    if (animate) {
      timeoutId = setTimeout(() => {
        const color = classification === "טיל אדום" ? "#ef4444" :
          classification === "טיל ירוק" ? "#10b981" : "#f59e0b";

        const path = L.polyline.antPath([startPosition, endPosition], {
          color,
          weight: 3,
        });
        pathRef.current = path;
        path.addTo(mapInstance);

        const missileIcon = L.icon({
          iconUrl: '/missile-icon.svg',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const missile = L.marker(startPosition, { icon: missileIcon });
        missileRef.current = missile;
        missile.addTo(mapInstance);

        // Missile click handler
        missile.on('click', () => {
          if (isInterceptionMode) {
            if (classification !== "טיל אדום") {
              dispatch(missMissile());
            }
            audioRef.current.play();
            const interceptorStartPosition = mapInstance.getCenter();
            dispatch(addInterceptedMissile(missileId));

            const interceptorIcon = L.icon({
              iconUrl: '/interception-missile-icon.svg',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const interceptor = L.marker(interceptorStartPosition, { icon: interceptorIcon });
            interceptorRef.current = interceptor;
            interceptor.addTo(mapInstance);

            // Animate interceptor
            const startTime = Date.now();
            const duration = 1500;

            function animateInterceptor() {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);

              const lat = interceptorStartPosition.lat + (missile.getLatLng().lat - interceptorStartPosition.lat) * progress;
              const lng = interceptorStartPosition.lng + (missile.getLatLng().lng - interceptorStartPosition.lng) * progress;

              interceptor.setLatLng([lat, lng]);

              if (progress < 1) {
                requestAnimationFrame(animateInterceptor);
              } else {
                explosionSoundRef.current.play();
                setShowExplosion(true);
                dispatch(interceptMissile());
                setTimeout(() => {
                  setShowExplosion(false);
                  cleanup();
                }, 500);
              }
            }

            animateInterceptor();
          } else {
            dispatch(setChosenMissile({
              id: missileId,
              startPosition,
              endPosition,
              speed: `${speed} קמ"ש`,
              classification,
            }));
          }
        });

        // Animate missile
        const startTime = Date.now();
        const duration = 70000 * (10 / speed);

        function animateMissile() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const lat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
          const lng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;

          missile.setLatLng([lat, lng]);

          if (progress < 1) {
            requestAnimationFrame(animateMissile);
          } else {
            cleanup();
          }
        }

        animateMissile();
      }, delay);
    }

    const cleanup = () => {
      if (pathRef.current && mapInstance.hasLayer(pathRef.current)) {
        mapInstance.removeLayer(pathRef.current);
      }
      if (missileRef.current && mapInstance.hasLayer(missileRef.current)) {
        mapInstance.removeLayer(missileRef.current);
      }
      if (interceptorRef.current && mapInstance.hasLayer(interceptorRef.current)) {
        mapInstance.removeLayer(interceptorRef.current);
      }
    };

    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [animate, mapInstance, startPosition, endPosition, delay, speed, classification, dispatch, isInterceptionMode, missileId]);

  return null;
});

// Memoized Main Map Component
const Map = memo(() => {
  console.log("Map component rendering");
  
  const [missiles, setMissiles] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
      mapInstanceRef.current = L.map(mapRef.current).setView(israelCenter, 8);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("Starting missile generation");
    let missileCount = 0;
    const maxMissiles = 10;
    
    const sources = [lebanonPosition, jordanPosition, seaPosition, gazaPosition];

    const interval = setInterval(() => {
      if (missileCount >= maxMissiles) {
        clearInterval(interval);
        return;
      }

      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      
      setMissiles(prev => [...prev, {
        id: `${Date.now()}-${missileCount}`,
        startPosition: randomSource,
        endPosition: missileTargets[Math.floor(Math.random() * missileTargets.length)],
        speed: Math.round(Math.random() * (50 - 40) + 40),
        classification: "טיל אדום"
      }]);

      console.log(`Generated missile ${missileCount + 1}`);
      missileCount++;
    }, 2000);

    return () => {
      console.log("Cleaning up missile generation");
      clearInterval(interval);
    };
  }, []);

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
});

// Add display names for debugging
Map.displayName = 'Map';
MissilePath.displayName = 'MissilePath';

export default Map;