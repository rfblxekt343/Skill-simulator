import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-ant-path";
import { useDispatch, useSelector } from 'react-redux';
import { setChosenMissile } from '../../store/game/chosenMissileGameSlice';
import { addInterceptedMissile } from '../../store/game/interceptionGameSlice';
import { interceptMissile,missMissile } from '../../store/game/missileStockGameSlice';
import { motion, AnimatePresence } from 'framer-motion';

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
const haifaPosition = { lat: 32.7940, lng: 34.9896 };
const seaPosition = { lat: 32.0, lng: 33.0 };
const jordanPosition = { lat: 32.0667, lng: 35.9333 };
const lebanonPosition = { lat: 33.8547, lng: 35.8623 };
const jerusalemPosition = { lat: 31.7683, lng: 35.2137 };
const gazaPosition = { lat: 31.5, lng: 34.45 };

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const ExplosionEffect = ({ position }) => {
  const map = useMap();
  const pixelPosition = map.latLngToContainerPoint(position);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          left: pixelPosition.x - 50,
          top: pixelPosition.y - 50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 165, 0, 0.6)',
          boxShadow: '0 0 20px 10px rgba(255, 165, 0, 0.4)',
          zIndex: 1000,
        }}
      />
    </AnimatePresence>
  );
};

const MissilePath = ({ startPosition, endPosition, animate, delay = 0, missileId, speed, classification }) => {
  const map = useMap();
  const missileRef = useRef(null);
  const pathRef = useRef(null);
  const interceptorRef = useRef(null);
  const interceptorAnimationFrameRef = useRef(null);
  const missileAnimationFrameRef = useRef(null);
  const dispatch = useDispatch();
  const isInterceptionMode = useSelector((state) => state.interceptionGame.isInterceptionMode);
  const isInterceptionModeRef = useRef(isInterceptionMode);
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState(null);
  
  const audioRef = useRef(new Audio('/sounds/טיל-שוגר.wav'));
  const explosionSoundRef = useRef(new Audio('/sounds/Explosion.mp3'));

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      explosionSoundRef.current.pause();
      explosionSoundRef.current.currentTime = 0;
      if (missileAnimationFrameRef.current) {
        cancelAnimationFrame(missileAnimationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    isInterceptionModeRef.current = isInterceptionMode;
  }, [isInterceptionMode]);

  useEffect(() => {
    let animationTimer;

    if (animate) {
      animationTimer = setTimeout(() => {
        let color;
        if (classification === "טיל אדום") {
          color = "#ef4444";
        } else if (classification === "טיל ירוק") {
          color = "#10b981";
        } else if (classification === "טיל צהוב") {
          color = "#f59e0b";
        }

        const path = L.polyline.antPath([startPosition, endPosition], {
          color: color,
          weight: 3,
        });
        pathRef.current = path;
        path.addTo(map);

        const missileIcon = L.icon({
          iconUrl: '/missile-icon.svg',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const missile = L.marker(startPosition, { icon: missileIcon });
        missileRef.current = missile;

        missile.addTo(map);
        missile.on('click', () => {
          if (isInterceptionModeRef.current) {
            if (classification !== "טיל אדום") {
              dispatch(missMissile());
            }
            audioRef.current.play();
            const interceptorStartPosition = map.getCenter();
            dispatch(addInterceptedMissile(missileId));

            const interceptorIcon = L.icon({
              iconUrl: '/interception-missile-icon.svg',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const interceptor = L.marker(interceptorStartPosition, { icon: interceptorIcon }).addTo(map);
            interceptorRef.current = interceptor;

            const interceptorAnimation = () => {
              const duration = 1500;
              const startTime = Date.now();

              const animate = () => {
                if (!isInterceptionModeRef.current) {
                  map.removeLayer(interceptor);
                  return;
                }

                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                const lat = interceptorStartPosition.lat + (missile.getLatLng().lat - interceptorStartPosition.lat) * progress;
                const lng = interceptorStartPosition.lng + (missile.getLatLng().lng - interceptorStartPosition.lng) * progress;

                interceptor.setLatLng([lat, lng]);

                if (progress < 1) {
                  interceptorAnimationFrameRef.current = requestAnimationFrame(animate);
                } else {
                  if (isInterceptionModeRef.current) {
                    explosionSoundRef.current.play();
                    setShowExplosion(true);
                    setExplosionPosition(missile.getLatLng());
                    dispatch(interceptMissile());
                    setTimeout(() => {
                      setShowExplosion(false);
                      map.removeLayer(missile);
                      map.removeLayer(interceptor);
                      map.removeLayer(path);
                    }, 500);
                  } else {
                    map.removeLayer(interceptor);
                  }
                }
              };

              animate();
            };

            interceptorAnimation();
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

        const animateMissile = () => {
          const durationInMs = 70000 * (10 / speed);
          const startTime = Date.now();

          const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / durationInMs, 1);

            const lat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
            const lng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;

            missile.setLatLng([lat, lng]);

            if (progress < 1) {
              missileAnimationFrameRef.current = requestAnimationFrame(animate);
            } else {
              // Remove missile and path when it reaches its destination
              map.removeLayer(missile);
              map.removeLayer(path);
            }
          };

          animate();
        };

        animateMissile();
      }, delay);
    }

    return () => {
      clearTimeout(animationTimer);
      if (interceptorAnimationFrameRef.current) {
        cancelAnimationFrame(interceptorAnimationFrameRef.current);
      }
      if (missileAnimationFrameRef.current) {
        cancelAnimationFrame(missileAnimationFrameRef.current);
      }
      if (pathRef.current && map.hasLayer(pathRef.current)) {
        map.removeLayer(pathRef.current);
      }
      if (missileRef.current && map.hasLayer(missileRef.current)) {
        map.removeLayer(missileRef.current);
      }
      if (interceptorRef.current && map.hasLayer(interceptorRef.current)) {
        map.removeLayer(interceptorRef.current);
      }
    };
  }, [animate, map, startPosition, endPosition, delay, dispatch, missileId, speed, classification]);

  return (
    <>
      {showExplosion && isInterceptionModeRef.current && <ExplosionEffect position={explosionPosition} />}
    </>
  );
};

const Map = () => {


  const [markerPosition, setMarkerPosition] = useState(position);
  const [missiles, setMissiles] = useState([]);
  ;
  const [missileLaunched, setMissileLaunched] = useState(true);



  const missileTargets = [
    { lat: 31.2543, lng: 34.7915, }, // Beer Sheva
    { lat: 31.8162, lng: 35.2137 }, // Jerusalem
    { lat: 31.2516, lng: 34.7915 }, // Ashdod
    { lat: 31.0461, lng: 34.8516 }, // Ashkelon
    { lat: 32.1877, lng: 34.8697 }, // Netanya
    { lat: 32.0167, lng: 34.7500 }, // Bat Yam
    { lat: 31.8928, lng: 34.8113 }, // Ramla
    { lat: 32.3275, lng: 34.8519 }, // Caesarea
  ];

  const generateMissileSource = () => {
    const sources = [
      { lat: 33.8547, lng: 35.8623 }, // Lebanon
      { lat: 32.0667, lng: 35.9333 }, // Jordan
      { lat: 32.0, lng: 33.0 },       // Sea
      { lat: 31.5, lng: 34.45 },      // Gaza
    ];
    return sources[Math.floor(Math.random() * sources.length)];
  };

  useEffect(() => {
    let missileCount = 0;
    const maxMissiles = 25;

    const launchInterval = setInterval(() => {
      if (missileCount >= maxMissiles) {
        clearInterval(launchInterval);
        return;
      }

      setMissiles(prev => [...prev, {
        id: `${missileCount}`,
        startPosition: generateMissileSource(),
        endPosition: missileTargets[Math.floor(Math.random() * missileTargets.length)],
        speed: Math.round(Math.random() * (50 - 40) + 40), // Random speed between 40-50
        classification: "טיל אדום"
      }]);

      missileCount++;
    }, 1000); // Launch a new missile every second

    return () => clearInterval(launchInterval);
  }, []);


  const handleDrop = (e) => {
    setMarkerPosition(e.latlng);
  };

  return (
    <div className="flex flex-col items-center p-4  min-h-screen">
      <div className="w-full h-[75vh] md:w-[90vw] lg:w-[85vw] max-w-screen-xl mt-12">
        <MapContainer
          center={israelCenter}
          zoom={8}
          className="h-full w-full rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {missiles.map(missile => (
            <MissilePath
              key={missile.id}
              missileId={missile.id}
              startPosition={missile.startPosition}
              endPosition={missile.endPosition}
              animate={true}
              speed={missile.speed}
              classification={missile.classification}
            />
          ))}



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
            missileId="2"
            startPosition={gazaPosition}
            endPosition={jerusalemPosition}
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
          <MissilePath
            missileId="3"
            startPosition={seaPosition}
            endPosition={haifaPosition}
            animate={missileLaunched}
            delay={6000}
            speed={15}
            classification="טיל צהוב"
          />

          <Marker position={markerPosition} draggable={true} eventHandlers={{ dragend: handleDrop }}>
            <Popup>
              <span>You are here!</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;