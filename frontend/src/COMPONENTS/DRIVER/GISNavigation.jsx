import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import RouteDetailsPanel from './RouteDetailsPanel';
import StatusBar from './StatusBar';
import ControlButtons from './ControlButtons';
import EmergencyButton from './EmergencyButton';

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

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAX6CARa4Xsi3xjS4-j_UgbW1vbcZN5SAc', // Replace with your actual Google Maps API key
    libraries: ['places'],
  });

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

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 pl-20">
      <StatusBar />
      
      <div className="flex flex-1 mt-4"> {/* Reduced margin-top to adjust space */}
        <RouteDetailsPanel />
        <div className="flex-1">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition || defaultCenter}
            zoom={13}
          >
            {currentPosition && <Marker position={currentPosition} />}
          </GoogleMap>
        </div>
      </div>
      <ControlButtons />
      <EmergencyButton />
    </div>
  );
};

export default GISNavigation;
