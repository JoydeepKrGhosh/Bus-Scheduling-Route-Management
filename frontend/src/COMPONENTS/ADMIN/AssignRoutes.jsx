import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const geoapifyKey = '38f3d26824c541c798b28f20ff36c638';

const AssignRoutes = () => {
  const [routes, setRoutes] = useState([]); // All routes
  const [selectedRoute, setSelectedRoute] = useState(null); // Selected route details
  const [routeId, setRouteId] = useState(''); // Selected route ID
  const [startLocation, setStartLocation] = useState(''); // Start location input
  const [endLocation, setEndLocation] = useState(''); // End location input
  const [startSuggestions, setStartSuggestions] = useState([]); // Suggestions for start location
  const [endSuggestions, setEndSuggestions] = useState([]); // Suggestions for end location

  // Fetch all routes for dropdown
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/showadminroutes/routes');
        const data = await response.json();
        setRoutes(data); // Set the fetched routes
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  // Fetch specific route details when routeId changes
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

  // Handle route selection change
  const handleRouteChange = (event) => {
    setRouteId(event.target.value);
  };

  // Validate coordinates
  const isValidCoordinates = (coordinates) => {
    return Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]);
  };

  // Fetch suggestions from Geoapify API
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

  // Handle saving the new route to the backend
  const saveRoute = async () => {
    const routeData = {
      startLocation,
      endLocation,
    };

    try {
      await axios.post('http://localhost:5000/api/busroute/api/generateroute', routeData); // API call to save the route
      alert('Route saved successfully!');
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  // Handle refresh of the route dropdown
  const refreshRoutes = async () => {
    const response = await fetch('http://localhost:5000/api/showadminroutes/routes');
    const data = await response.json();
    setRoutes(data);
  };

  // Render the map
  const renderMap = () => {
    if (!selectedRoute) {
      return (
        <div
          style={{
            height: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            color: '#777'
          }}
        >
          Select a route to see it on the map.
        </div>
      );
    }

    const { startPoint, endPoint, routePath } = selectedRoute;

    if (!isValidCoordinates(startPoint.coordinates) || !isValidCoordinates(endPoint.coordinates)) {
      return <div>Invalid route data. Please check the coordinates for the route.</div>;
    }

    const mapCenter = [startPoint.coordinates[1], startPoint.coordinates[0]];

    const polylineCoordinates = routePath.coordinates
      .filter((coord) => isValidCoordinates(coord)) // Filter valid coordinates
      .map(([lng, lat]) => [lat, lng]); // Convert coordinates

    return (
      <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Start Marker */}
        <Marker position={[startPoint.coordinates[1], startPoint.coordinates[0]]}>
          <Popup>Start: {startPoint.name || 'No Name'}</Popup>
        </Marker>

        {/* End Marker */}
        <Marker position={[endPoint.coordinates[1], endPoint.coordinates[0]]}>
          <Popup>End: {endPoint.name || 'No Name'}</Popup>
        </Marker>

        {/* Polyline */}
        {polylineCoordinates.length > 0 && <Polyline positions={polylineCoordinates} color="blue" />}
      </MapContainer>
    );
  };

  // Render instructions
  const renderInstructions = () => {
    if (!selectedRoute || !selectedRoute.instructions) {
      return null;
    }

    return (
      <div style={{ marginTop: '20px' }}>
        <h3>Turn-by-Turn Instructions</h3>
        <ul style={{ listStyleType: 'decimal' }}>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        margin: '20px auto',
        maxWidth: '800px'
      }}
    >
      <h2>Assign a Route</h2>

      {/* Search Box for Start Location */}
      <div style={{ width: '100%' }}>
        <label htmlFor="startLocation">Start Location:</label>
        <input
          id="startLocation"
          value={startLocation}
          onChange={(e) => {
            setStartLocation(e.target.value);
            fetchSuggestions(e.target.value, setStartSuggestions); // Fetch suggestions for start location
          }}
          placeholder="Enter start location"
          style={{ padding: '10px', width: '100%', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <ul style={{ backgroundColor: '#fff', border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto' }}>
          {startSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                setStartLocation(suggestion.properties.formatted);
                setStartSuggestions([]); // Clear suggestions after selection
              }}
              style={{ padding: '5px', cursor: 'pointer' }}
            >
              {suggestion.properties.formatted}
            </li>
          ))}
        </ul>
      </div>

      {/* Search Box for End Location */}
      <div style={{ width: '100%' }}>
        <label htmlFor="endLocation">End Location:</label>
        <input
          id="endLocation"
          value={endLocation}
          onChange={(e) => {
            setEndLocation(e.target.value);
            fetchSuggestions(e.target.value, setEndSuggestions); // Fetch suggestions for end location
          }}
          placeholder="Enter end location"
          style={{ padding: '10px', width: '100%', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <ul style={{ backgroundColor: '#fff', border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto' }}>
          {endSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                setEndLocation(suggestion.properties.formatted);
                setEndSuggestions([]); // Clear suggestions after selection
              }}
              style={{ padding: '5px', cursor: 'pointer' }}
            >
              {suggestion.properties.formatted}
            </li>
          ))}
        </ul>
      </div>

      {/* Dropdown for route selection */}
      <div style={{ width: '100%' }}>
        <label htmlFor="routeSelect">Select a Route:</label>
        <select
          id="routeSelect"
          value={routeId}
          onChange={handleRouteChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <option value="">-- Select a Route --</option>
          {routes.map((route) => (
            <option key={route.routeId} value={route.routeId}>
              Start: {route.startPoint.name || 'Unnamed'}, End: {route.endPoint.name || 'Unnamed'}
            </option>
          ))}
        </select>
      </div>

      {/* Save Route Button */}
      <button onClick={saveRoute} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Save Route
      </button>

      {/* Refresh Routes Button */}
      <button onClick={refreshRoutes} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
        Refresh Routes
      </button>

      {/* Map display */}
      <div style={{ width: '100%' }}>{renderMap()}</div>

      {/* Turn-by-turn instructions */}
      {renderInstructions()}
    </div>
  );
};

export default AssignRoutes;
