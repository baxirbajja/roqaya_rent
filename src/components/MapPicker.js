import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component dyal map
// Kay3tik interface bach tkhtar location
const MapPicker = ({ position, setPosition, readonly = false }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Initialize map
    const defaultCenter = [31.7917, -7.0926];
    const initialPosition = position || defaultCenter;

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(initialPosition, 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      if (!readonly) {
        // Fonction bach tsifet position l parent
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
        });
      }
    }

    // State dyal map w markers
    if (position) {
      // Fonction bach tbdl marker
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      } else {
        markerRef.current = L.marker(position).addTo(mapRef.current);
      }
      mapRef.current.setView(position, 15);
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [position, setPosition, readonly]);

  // Affichage dyal map
  return (
    <div 
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  );
};

export default MapPicker;
