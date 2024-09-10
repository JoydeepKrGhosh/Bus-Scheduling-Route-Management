import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { FaArrowLeft } from 'react-icons/fa'; // Importing the back icon

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const AssignRoutes = ({ darkMode, handleCardClick }) => {
  const [buses, setBuses] = useState([
    { id: 1, position: { lat: 28.7041, lng: 77.1025 }, route: 'Route A' },
    { id: 2, position: { lat: 28.5355, lng: 77.3910 }, route: 'Route B' },
  ]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null); // User's current location

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAX6CARa4Xsi3xjS4-j_UgbW1vbcZN5SAc', // Replace with your actual API key
    libraries: ['marker'], // Include 'marker' library for AdvancedMarkerElement
  });

  useEffect(() => {
    if (isLoaded) {
      // Get user's current location using Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );

      // Add markers for buses
      buses.forEach((bus) => {
        const markerElement = document.createElement('div');
        markerElement.style.backgroundImage = 'url("https://example.com/bus-icon.png")'; // Use your actual bus icon
        markerElement.style.width = '35px';
        markerElement.style.height = '35px';
        markerElement.style.backgroundSize = 'contain';

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: bus.position,
          map: window.googleMap, // Reference to your GoogleMap instance
          content: markerElement, // Custom content
          draggable: true,
        });

        // Handle dragging of markers
        marker.addListener('dragend', (event) => {
          const newBuses = buses.map((b) => {
            if (b.id === bus.id) {
              return {
                ...b,
                position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
              };
            }
            return b;
          });
          setBuses(newBuses);
        });

        // Store the marker for future use (e.g., to remove later if needed)
        bus.marker = marker;
      });
    }
  }, [isLoaded, buses]);

  // Handle save functionality
  const handleSave = () => {
    console.log('Buses assigned to new routes:', buses);
    alert('Bus routes saved successfully!');
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className="w-full h-[600px] flex flex-col items-center justify-center p-6 mt-16">
      {/* Back Button */}
      <div className="w-full flex items-center mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          onClick={() => handleCardClick('overview')} // Return to main card section
        >
          <FaArrowLeft /> {/* Back icon */}
          <span>Back</span>
        </button>
      </div>

      <div className="w-full h-[500px] mb-4">
        <GoogleMap
          id="google-map"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(map) => {
            // Store the map instance for future reference
            window.googleMap = map;
          }}
        >
          {/* Display buses as markers */}
          {buses.map((bus) => (
            <InfoWindow
              key={bus.id}
              position={bus.position}
              onCloseClick={() => setSelectedBus(null)}
            >
              <div>
                <h2>Bus {bus.id}</h2>
                <p>Current Route: {bus.route}</p>
              </div>
            </InfoWindow>
          ))}

          {/* Show current location as a marker */}
          {currentLocation && (
            <InfoWindow
              position={currentLocation}
              onCloseClick={() => setCurrentLocation(null)}
            >
              <div>
                <h2>You are here</h2>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      <button
        className={`px-6 py-2 rounded-md font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'} hover:bg-blue-800`}
        onClick={handleSave}
      >
        Save Routes
      </button>
    </div>
  );
};

export default AssignRoutes;
