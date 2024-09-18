import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AssignRoutes = () => {
  const [routes, setRoutes] = useState([]); // All routes
  const [selectedRoute, setSelectedRoute] = useState(null); // Selected route details
  const [source, setSource] = useState(''); // Source destination input
  const [destination, setDestination] = useState(''); // Final destination input

  // Fetch all routes for selection
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/showadminroutes/routes');
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  // Handle source and destination input changes
  const handleSourceChange = (event) => {
    setSource(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  // Handle save route action
  const handleSaveRoute = () => {
    if (source && destination) {
      console.log('Route saved:', { source, destination });
      setSource('');
      setDestination('');
    } else {
      alert('Please enter both source and destination');
    }
  };

  // Check if the coordinates are valid
  const isValidCoordinates = (coordinates) => {
    return Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]);
  };

  // Render the map
  const renderMap = () => {
    if (!selectedRoute) {
      return (
        <div className="h-[500px] flex justify-center items-center bg-gray-200 border border-gray-300 text-gray-500">
          Select a route to see it on the map.
        </div>
      );
    }

    const { startPoint, endPoint, routePath, instructions } = selectedRoute;

    if (!isValidCoordinates(startPoint.coordinates) || !isValidCoordinates(endPoint.coordinates)) {
      return <div>Invalid route data. Please check the coordinates for the route.</div>;
    }

    const mapCenter = [startPoint.coordinates[1], startPoint.coordinates[0]];
    const polylineCoordinates = routePath.coordinates
      .filter((coord) => isValidCoordinates(coord))
      .map(([lng, lat]) => [lat, lng]);

    return (
      <MapContainer center={mapCenter} zoom={13} className="h-[500px] w-full">
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=38f3d26824c541c798b28f20ff36c638`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Start Marker */}
        {isValidCoordinates(startPoint.coordinates) && (
          <Marker position={[startPoint.coordinates[1], startPoint.coordinates[0]]}>
            <Popup>Start: {startPoint.name || 'No Name'}</Popup>
          </Marker>
        )}

        {/* End Marker */}
        {isValidCoordinates(endPoint.coordinates) && (
          <Marker position={[endPoint.coordinates[1], endPoint.coordinates[0]]}>
            <Popup>End: {endPoint.name || 'No Name'}</Popup>
          </Marker>
        )}

        {/* Polyline for the route path */}
        {polylineCoordinates.length > 0 && <Polyline positions={polylineCoordinates} color="blue" />}
      </MapContainer>
    );
  };

  // Render turn-by-turn instructions
  const renderInstructions = () => {
    if (!selectedRoute || !selectedRoute.instructions) {
      return null;
    }

    return (
      <div className="mt-5">
        <h3 className="font-bold">Turn-by-Turn Instructions</h3>
        <ul className="list-decimal">
          {selectedRoute.instructions.map((instruction, index) => (
            <li key={index}>
              {instruction.instruction} (Distance: {instruction.distance}m, Time: {instruction.time.toFixed(2)}s)
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-5 mx-auto my-5 max-w-[800px]">
      <h1 className="text-2xl font-bold pb-4">Assign a Route</h1>

      {/* Row for source, destination, and save button */}
      <div className="flex flex-row items-center gap-3 w-full">
        {/* Source Destination Search Bar */}
        <div className="flex-1">
          <label htmlFor="source" className="font-bold block mb-2">Source Destination:</label>
          <input
            id="source"
            type="text"
            value={source}
            onChange={handleSourceChange}
            placeholder="Enter Source"
            className="p-2 text-lg w-full border border-gray-300 rounded"
          />
        </div>

        {/* Final Destination Search Bar */}
        <div className="flex-1">
          <label htmlFor="destination" className="font-bold block mb-2">Final Destination:</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={handleDestinationChange}
            placeholder="Enter Destination"
            className="p-2 text-lg w-full border border-gray-300 rounded"
          />
        </div>

        {/* Save Routes Button */}
        <button
          onClick={handleSaveRoute}
          className="mt-8 p-2 text-lg bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Route
        </button>
      </div>

      {/* Map display */}
      <div className="w-full">
        {renderMap()}
      </div>

      {/* Turn-by-turn instructions */}
      {renderInstructions()}
    </div>
  );
};

export default AssignRoutes;
