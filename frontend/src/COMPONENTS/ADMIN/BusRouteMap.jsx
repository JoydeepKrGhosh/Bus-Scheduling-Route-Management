import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom bus icon for Leaflet map
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/67/67997.png',
  iconSize: [25, 25], // Adjust size as needed
});

function BusRouteMap({ bus, onClose }) {
  // Example hardcoded route with coordinates (starting point, route, and destination)
  const routeCoordinates = [
    [28.7041, 77.1025], // Starting point (Latitude, Longitude)
    [28.7048, 77.1034], // Midpoint (Bus in progress)
    [28.7056, 77.1043], // Destination
  ];

  // Simulated current bus position based on progress
  const getBusPosition = () => {
    const progressIndex = Math.floor((bus.progress / 100) * (routeCoordinates.length - 1));
    return routeCoordinates[progressIndex];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6">Bus Route Map - {bus.id}</h2>

        {/* Leaflet Map with Route */}
        <div className="w-full h-96">
          <MapContainer
            center={routeCoordinates[0]} // Start the map view from the starting point
            zoom={13}
            scrollWheelZoom={false}
            className="h-full rounded-lg"
          >
            {/* Map Layer */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Route Polyline */}
            <Polyline
              positions={routeCoordinates}
              color="blue"
              weight={4}
              opacity={0.7}
            />

            {/* Bus Position Marker */}
            <Marker position={getBusPosition()} icon={busIcon}>
              <Popup>
                Bus ID: {bus.id} <br />
                Current Location: {bus.location}
              </Popup>
            </Marker>

            {/* Markers for Starting Point and Destination */}
            <Marker position={routeCoordinates[0]}>
              <Popup>Starting Point</Popup>
            </Marker>
            <Marker position={routeCoordinates[routeCoordinates.length - 1]}>
              <Popup>Destination</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default BusRouteMap;
