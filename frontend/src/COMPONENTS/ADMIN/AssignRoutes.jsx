import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '700px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const center = {
  lat: 28.6139, // Example center point
  lng: 77.2090, // Example center point
};

const AssignRoutes = ({ darkMode, handleCardClick }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [route, setRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const geoapifyKey = '38f3d26824c541c798b28f20ff36c638';

  // Auto-generation of suggestions when the input changes
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

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    fetchSuggestions(e.target.value, setSourceSuggestions);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchSuggestions(e.target.value, setDestinationSuggestions);
  };

  const handleSuggestionClick = (suggestion, setCoords, setInput) => {
    setCoords([suggestion.geometry.coordinates[1], suggestion.geometry.coordinates[0]]);
    setInput(suggestion.properties.formatted);
    setSourceSuggestions([]);
    setDestinationSuggestions([]);
  };

  // Fetch route data from API
  useEffect(() => {
    const fetchRouteData = async () => {
      if (sourceCoords && destinationCoords) {
        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/routing?waypoints=${sourceCoords[0]},${sourceCoords[1]}|${destinationCoords[0]},${destinationCoords[1]}&mode=drive&apiKey=${geoapifyKey}`
          );
          const routePath = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoute(routePath);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      }
    };
    fetchRouteData();
  }, [sourceCoords, destinationCoords]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 mt-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Assign Routes to Buses</h1>

      <div className="w-full flex items-center mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="w-full flex flex-col gap-6 mb-6">
        <div className="w-full">
          <label className="block mb-2 font-semibold text-lg">Source</label>
          <input
            placeholder="Enter source location"
            value={source}
            onChange={handleSourceChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          {sourceSuggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-auto mt-2">
              {sourceSuggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.place_id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion, setSourceCoords, setSource)}
                >
                  {suggestion.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full">
          <label className="block mb-2 font-semibold text-lg">Destination</label>
          <input
            placeholder="Enter destination location"
            value={destination}
            onChange={handleDestinationChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          {destinationSuggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-auto mt-2">
              {destinationSuggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.place_id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion, setDestinationCoords, setDestination)}
                >
                  {suggestion.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full flex justify-end gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors">
            Generate Route
          </button>
        </div>
      </div>

      <div className="w-full h-[700px] mb-4">
        <MapContainer center={center} zoom={12} style={containerStyle}>
          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`}
            attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors'
          />

          {route.length > 0 && <Polyline positions={route} color="blue" />}

          {sourceCoords && <Marker position={sourceCoords}></Marker>}
          {destinationCoords && <Marker position={destinationCoords}></Marker>}
        </MapContainer>
      </div>
    </div>
  );
};

export default AssignRoutes;
