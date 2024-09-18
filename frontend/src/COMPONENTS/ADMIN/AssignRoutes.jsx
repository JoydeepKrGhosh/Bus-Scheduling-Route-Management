import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AssignRoutes = () => {
  const [routes, setRoutes] = useState([]); // All routes
  const [selectedRoute, setSelectedRoute] = useState(null); // Selected route details
  const [routeId, setRouteId] = useState(''); // Selected route ID

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

  // Fetch specific route when a route is selected
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

  // Check if the coordinates are valid
  const isValidCoordinates = (coordinates) => {
    return Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]);
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

    const { startPoint, endPoint, routePath, instructions } = selectedRoute;

    // Validate that the start and end points have valid coordinates
    if (!isValidCoordinates(startPoint.coordinates) || !isValidCoordinates(endPoint.coordinates)) {
      return <div>Invalid route data. Please check the coordinates for the route.</div>;
    }

    // Define map center based on the start point
    const mapCenter = [startPoint.coordinates[1], startPoint.coordinates[0]];

    // Convert routePath coordinates from GeoJSON format to Leaflet Polyline format
    const polylineCoordinates = routePath.coordinates
      .filter((coord) => isValidCoordinates(coord)) // Ensure all coordinates are valid
      .map(([lng, lat]) => [lat, lng]);

    return (
      <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', margin: '20px auto', maxWidth: '800px' }}>
      <h2>Assign a Route</h2>

      {/* Dropdown for route selection */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
        <label htmlFor="routeSelect" style={{ fontWeight: 'bold' }}>Select a Route:</label>
        <select
          id="routeSelect"
          value={routeId}
          onChange={handleRouteChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '4px'
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

      {/* Map display */}
      <div style={{ width: '100%' }}>
        {renderMap()}
      </div>

      {/* Turn-by-turn instructions */}
      {renderInstructions()}
    </div>
  );
};

export default AssignRoutes;
