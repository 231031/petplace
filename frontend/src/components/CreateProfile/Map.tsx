import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';

interface MapProps {
  latitude?: number;
  longitude?: number;
}

const Map = ({ latitude, longitude }: MapProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null); // User's location
  const [error, setError] = useState<string | null>(null); // Error state
  const mapRef = useRef<any>(null);

  // If latitude and longitude are passed, use them as the initial position
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    } else {
      // Use Geolocation API to get the user's current position
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]); // Set user's position
            console.log(position.coords);
          },
          (err) => {
            setError('Unable to retrieve your location.');
            // Default to Bangkok if geolocation fails
            setPosition([13.736717, 100.523186]);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setPosition([13.736717, 100.523186]); // Default to Bangkok if geolocation is not supported
      }
    }
  }, [latitude, longitude]);

  // Location marker component that updates the position on click
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]); // Update position on map click
        console.log(`New position: ${e.latlng.lat}, ${e.latlng.lng}`);
      },
    });
    return <Marker position={position || [13.736717, 100.523186]} />;
  };

  // Wait until the user's location is loaded
  if (!position) {
    return <div>Loading...</div>; // Loading state until position is set
  }

  return (
    <div className="h-full">
      {error && <div>{error}</div>} {/* Show error message if any */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenReady={() => {
          const map = mapRef.current;
          if (map && position) {
            map.setZoom(13);
          }
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default Map;
