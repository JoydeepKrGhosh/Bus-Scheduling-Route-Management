import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RouteDetailsPanel from './RouteDetailsPanel';
import StatusBar from './StatusBar';
import ControlButtons from './ControlButtons';
import EmergencyButton from './EmergencyButton';

// Fix for default Leaflet marker icon not being found
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 28.7041,
  lng: 77.1025, // Default to Delhi if current position is not available
};

const GISNavigation = ({ darkMode }) => {
  const [currentPosition, setCurrentPosition] = useState(null);

  // Get the user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting location: ', error);
      }
    );
  }, []);

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 pl-20">
      <StatusBar />
      
      <div className="flex flex-1 mt-4"> {/* Reduced margin-top to adjust space */}
        <RouteDetailsPanel />
        <div className="flex-1">
          <MapContainer
            style={containerStyle}
            center={currentPosition || defaultCenter}
            zoom={13}
            scrollWheelZoom={false}
          >
            {/* Geoapify TileLayer */}
            <TileLayer
              url="https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=38f3d26824c541c798b28f20ff36c638"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & Geoapify'
            />
            {currentPosition && (
              <Marker position={currentPosition} />
            )}
          </MapContainer>
        </div>
      </div>
      <ControlButtons />
      <EmergencyButton />
    </div>
  );
};

export default GISNavigation;
