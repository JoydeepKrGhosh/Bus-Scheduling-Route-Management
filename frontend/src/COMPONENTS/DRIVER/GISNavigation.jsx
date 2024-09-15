import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-hidden`}>
      <StatusBar />

      <div className="flex flex-1 flex-col md:flex-row mt-2 md:mt-4">
        <div className="w-full md:w-1/3 lg:w-1/4 p-2">
          <RouteDetailsPanel />
        </div>
        <div className="flex-1 p-2">
          <MapContainer
            style={containerStyle}
            center={currentPosition || defaultCenter}
            zoom={13}
            scrollWheelZoom={false}
          >
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

      <div className="flex flex-col md:flex-row justify-between p-4">
        <ControlButtons />
        <EmergencyButton />
      </div>
    </div>
  );
};

export default GISNavigation;
