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
    const response = await fetch('http://localhost:5000/api/showadminroutes/routes');
    const data = await response.json();
    setRoutes(data);
    setIsLoading(false); // Hide loader when done
  };
  
  const renderMap = () => {
    if (!selectedRoute) {
      return (
              <li
                key={index}
                onClick={() => {
                  setStartLocation(suggestion.properties.formatted);
                  setStartSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              <li
                key={index}
                onClick={() => {
                  setEndLocation(suggestion.properties.formatted);
                  setEndSuggestions([]);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
