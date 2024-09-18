import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '700px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const AssignRoutes = ({ darkMode, handleCardClick }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [route, setRoute] = useState([]);

  const geoapifyKey = '38f3d26824c541c798b28f20ff36c638';

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
    <div className="w-full flex flex-col items-center justify-center p-4 sm:flex">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Assign Routes to Buses
      </h1>

      <div className="w-full flex items-center mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => handleCardClick('overview')}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>
      <div className=' flex flex-auto flex-row w-full gap-7'>
        <div className=" max-w-md flex flex-col gap-6 mb-6">
          <div className="w-full">
            <label className="block mb-2 font-semibold text-lg">Source</label>
            <input
              type="text"
              value={source}
              onChange={handleSourceChange}
              placeholder="Enter source location"
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
              type="text"
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Enter destination location"
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
        </div>

        <div className="w-full h-[300px]">
          <MapContainer center={center} zoom={15} style={containerStyle}>
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
    </div>
  );
};

export default AssignRoutes;