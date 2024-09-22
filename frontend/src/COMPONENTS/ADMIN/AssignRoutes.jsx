import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { FaArrowLeft } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const geoapifyKey = '38f3d26824c541c798b28f20ff36c638';

const AssignRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeId, setRouteId] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (routeId) {
      const fetchRouteDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/showadminroutes/route/${routeId}`);
          const data = await response.json();
          setSelectedRoute(data);
        } catch (error) {
          console.error('Error fetching route details:', error);
        }
      };
      fetchRouteDetails();
    }
  }, [routeId]);

  const handleRouteChange = (event) => {
    setRouteId(event.target.value);
  };

  const isValidCoordinates = (coordinates) => {
    return Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]);
  };

  const fetchSuggestions = async (input, setFunction) => {
    if (input.length > 2) {
      try {
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${geoapifyKey}`);
        setFunction(response.data.features);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }
  };

  const saveRoute = async () => {
    const routeData = {
      startLocation,
      endLocation,
    };
    try {
      await axios.post('http://localhost:5000/api/busroute/api/generateroute', routeData);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const refreshRoutes = async () => {
    setTimeout(() => setIsLoading(true),5000); // Show loader while refreshing
    const response = await fetch('https://bus-scheduling-route-management-1.onrender.com/api/showadminroutes/routes');
    const data = await response.json();
    setRoutes(data);
    setIsLoading(false); // Hide loader when done
  };
  
  const renderMap = () => {
    if (!selectedRoute) {
      return (
        <div className="h-[600px] flex items-center justify-center bg-gray-200 border border-gray-300 text-gray-600 rounded-lg shadow-md">
          <span>Select a route to see it on the map.</span>
        </div>
      );
    }

    const { startPoint, endPoint, routePath } = selectedRoute;

    if (!isValidCoordinates(startPoint.coordinates) || !isValidCoordinates(endPoint.coordinates)) {
      return <div className="text-red-500">Invalid route data. Please check the coordinates for the route.</div>;
    }

    const mapCenter = [startPoint.coordinates[1], startPoint.coordinates[0]];

    const polylineCoordinates = routePath.coordinates
      .filter((coord) => isValidCoordinates(coord))
      .map(([lng, lat]) => [lat, lng]);

    return (
      <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%' }} className="rounded-lg shadow-lg">
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[startPoint.coordinates[1], startPoint.coordinates[0]]}>
          <Popup>Start: {startPoint.name || 'No Name'}</Popup>
        </Marker>
        <Marker position={[endPoint.coordinates[1], endPoint.coordinates[0]]}>
          <Popup>End: {endPoint.name || 'No Name'}</Popup>
        </Marker>
        {polylineCoordinates.length > 0 && <Polyline positions={polylineCoordinates} color="blue" />}
      </MapContainer>
    );
  };

  const renderInstructions = () => {
    if (!selectedRoute || !selectedRoute.instructions) {
      return null;
    }

    return (
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md w-full">
        <h3 className="text-lg font-semibold text-gray-800">Turn-by-Turn Instructions</h3>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          {selectedRoute.instructions.map((instruction, index) => (
            <li key={index} className="mb-2">
              {instruction.instruction} (Distance: {instruction.distance}m, Time: {instruction.time.toFixed(2)}s)
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center gap-8 mx-auto my-[-10px] p-10 max-w-full min-h-screen bg-gray-50 shadow-2xl rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mt-[-25px] text-blue-500 underline">Assign a Route</h2>

      {showSuccessPopup && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-lg px-6 py-3 rounded-md shadow-lg">
          Route saved successfully!
        </div>
      )}

      <div className="w-full flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/2">
          <label htmlFor="startLocation" className="block text-sm font-semibold text-gray-800">Start Location:</label>
          <input
            id="startLocation"
            value={startLocation}
            onChange={(e) => {
              setStartLocation(e.target.value);
              fetchSuggestions(e.target.value, setStartSuggestions);
            }}
            placeholder="Enter start location"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <ul className="mt-1 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg">
            {startSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setStartLocation(suggestion.properties.formatted);
                  setStartSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion.properties.formatted}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-1/2">
          <label htmlFor="endLocation" className="block text-sm font-semibold text-gray-800">End Location:</label>
          <input
            id="endLocation"
            value={endLocation}
            onChange={(e) => {
              setEndLocation(e.target.value);
              fetchSuggestions(e.target.value, setEndSuggestions);
            }}
            placeholder="Enter end location"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <ul className="mt-1 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg">
            {endSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setEndLocation(suggestion.properties.formatted);
                  setEndSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion.properties.formatted}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full mt-4">
        <label htmlFor="routeSelect" className="block text-sm font-semibold text-gray-800">Select a Route:</label>
        <select
          id="routeSelect"
          value={routeId}
          onChange={handleRouteChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Select a Route --</option>
          {routes.map((route) => (
            <option key={route.routeId} value={route.routeId}>
              Start: {route.startPoint.name || 'Unnamed'}, End: {route.endPoint.name || 'Unnamed'}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full flex items-center justify-end gap-3">
        <button
          onClick={saveRoute}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          Save Route
        </button>
        <button
          onClick={refreshRoutes}
          className={`px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Routes'}
        </button>
      </div>

      <div className="w-full">
        {renderMap()}
      </div>

      

      {renderInstructions()}
    </div>
  );
};

export default AssignRoutes;