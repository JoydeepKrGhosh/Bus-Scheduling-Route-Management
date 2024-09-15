import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Importing the back icon
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const AssignRoutes = ({ darkMode, handleCardClick }) => {
  const [buses, setBuses] = useState([
    { id: 1, position: { lat: 28.7041, lng: 77.1025 }, route: 'Route A' },
    { id: 2, position: { lat: 28.5355, lng: 77.3910 }, route: 'Route B' },
  ]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [route, setRoute] = useState([]);

  const geoapifyKey = '38f3d26824c541c798b28f20ff36c638'; // Replace with your Geoapify API key

  const fetchSuggestions = async (input, setFunction) => {
    if (input.length > 2) {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${geoapifyKey}`
      );
      setFunction(response.data.features);
    } else {
      setFunction([]);
    }
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    fetchSuggestions(e.target.value, setSuggestions);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchSuggestions(e.target.value, setSuggestions);
  };

  const handleSuggestionClick = (suggestion, setCoords) => {
    setCoords([suggestion.geometry.coordinates[1], suggestion.geometry.coordinates[0]]);
    setSuggestions([]);
  };

  const generateRoute = async () => {
    if (sourceCoords && destinationCoords) {
      const response = await axios.get(
        `https://api.geoapify.com/v1/routing?waypoints=${sourceCoords[0]},${sourceCoords[1]}|${destinationCoords[0]},${destinationCoords[1]}&mode=drive&apiKey=${geoapifyKey}`
      );
      setRoute(response.data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]));
    } else {
      alert('Please select both source and destination');
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10 mt-12 flex flex-col items-center">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Assign Routes to Buses
      </h1>

      {/* Back Button */}
      <div className="w-full flex items-center mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => handleCardClick('overview')} // Return to main card section
        >
          <FaArrowLeft /> {/* Back icon */}
          <span>Back</span>
        </button>
      </div>

      {/* Source and Destination Search Bars in a column for mobile and side-by-side for larger screens */}
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-6">
        {/* Source input */}
        <div className="w-full lg:w-1/2">
          <label className="block mb-2 font-semibold text-lg">Source</label>
          <input
            type="text"
            value={source}
            onChange={handleSourceChange}
            placeholder="Enter source location"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          {suggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-auto mt-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.place_id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion, setSourceCoords)}
                >
                  {suggestion.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination input */}
        <div className="w-full lg:w-1/2">
          <label className="block mb-2 font-semibold text-lg">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={handleDestinationChange}
            placeholder="Enter destination location"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          {suggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md max-h-40 overflow-auto mt-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.properties.place_id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion, setDestinationCoords)}
                >
                  {suggestion.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Generate Route and Save Route buttons */}
      <div className="w-full flex justify-end gap-4 mb-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors"
          onClick={generateRoute}
        >
          Generate Routes
        </button>

        <button
          className={`px-6 py-2 rounded-md font-semibold shadow-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'
            } hover:bg-blue-700 transition-colors`}
          onClick={() => alert('Routes saved!')}
        >
          Save Routes
        </button>
      </div>

      {/* Map Container */}
      <div className="w-full h-[400px] lg:h-[700px] mb-4">
        <MapContainer center={[28.6139, 77.2090]} zoom={12} className="h-full w-full rounded-lg shadow-lg">
          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`}
            attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors'
          />

          {/* Show buses on the map */}
          {buses.map((bus) => (
            <Marker key={bus.id} position={bus.position}></Marker>
          ))}

          {/* Show the generated route */}
          {route.length > 0 && <Polyline positions={route} color="blue" />}

          {/* Markers for source and destination */}
          {sourceCoords && <Marker position={sourceCoords}></Marker>}
          {destinationCoords && <Marker position={destinationCoords}></Marker>}
        </MapContainer>
      </div>
    </div>
  );
};

export default AssignRoutes;
