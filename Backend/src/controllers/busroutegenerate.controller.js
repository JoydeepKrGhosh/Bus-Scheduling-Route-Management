const axios = require('axios');
const Route = require('../models/route.model.js'); // Import your Route model

// Function to geocode a location and get latitude and longitude
const geocodeLocation = async (locationName) => {
  try {
    const response = await axios.get('https://api.geoapify.com/v1/geocode/search', {
      params: {
        apiKey: process.env.GEOAPIFY_API_KEY,
        text: locationName,
      }
    });
    
    const results = response.data.features;
    if (results.length === 0) {
      throw new Error(`No results found for ${locationName}`);
    }

    const { lat, lon } = results[0].properties; // Extract lat and lon from the first result
    return { lat, lon };
    
  } catch (error) {
    console.error(`Error geocoding location ${locationName}:`, error);
    throw new Error(`Geocoding failed for ${locationName}`);
  }
};

// Function to check if a route already exists (in either direction)
const checkRouteExists = async (startCoords, endCoords) => {
  const existingRoute = await Route.findOne({
    $or: [
      { 'startPoint.coordinates': startCoords, 'endPoint.coordinates': endCoords },
      { 'startPoint.coordinates': endCoords, 'endPoint.coordinates': startCoords }
    ]
  });
  return existingRoute;
};

// Function to fetch route from Geoapify and store it in MongoDB
const fetchAndStoreRoute = async (req, res) => {
  const { startLocation, endLocation } = req.body; // Assuming you'll pass names instead

  try {
    // Geocode start and end locations to get their coordinates
    const startPoint = await geocodeLocation(startLocation);
    const endPoint = await geocodeLocation(endLocation);

    // Check if the route already exists (A to B or B to A)
    const routeExists = await checkRouteExists([startPoint.lon, startPoint.lat], [endPoint.lon, endPoint.lat]);
    if (routeExists) {
      return res.status(400).json({ message: 'Route already exists' });
    }

    // Make a request to Geoapify to get the route between two points
    const geoapifyResponse = await axios.get('https://api.geoapify.com/v1/routing', {
      params: {
        apiKey: process.env.GEOAPIFY_API_KEY,
        waypoints: `${startPoint.lat},${startPoint.lon}|${endPoint.lat},${endPoint.lon}`,
        mode: 'bus' // mode of transport
      }
    });

    const routeData = geoapifyResponse.data.features[0]; // Extract the feature from the response
    const coordinates = routeData.geometry.coordinates[0]; // Extract coordinates for the entire route from the geometry section

    // Extract waypoints (start and end points)
    const waypoints = routeData.properties.waypoints.map(waypoint => ({
      coordinates: [waypoint.lon, waypoint.lat]
    }));

    // Extract the steps (legs) with instructions, distances, and times
    const steps = routeData.properties.legs[0].steps.map(step => ({
      from_index: step.from_index,
      to_index: step.to_index,
      distance: step.distance,
      time: step.time,
      instruction: step.instruction.text
    }));

    // Create and save the route from A to B
    const newRoute = new Route({
      routeId: `route_${Date.now()}`,
      startPoint: {
        type: 'Point',
        name: startLocation,
        coordinates: [startPoint.lon, startPoint.lat]
      },
      endPoint: {
        type: 'Point',
        name: endLocation,
        coordinates: [endPoint.lon, endPoint.lat]
      },
      waypoints: waypoints.map(waypoint => ({
        type: 'Point',
        coordinates: [waypoint.lon, waypoint.lat]
      })),
      routePath: {
        type: 'LineString',
        coordinates
      },
      steps,
      distance: routeData.properties.legs[0].distance,
      time: routeData.properties.legs[0].time,
      createdAt: new Date()
    });

    await newRoute.save();

    // Create and save the reverse route (B to A)
    const reverseRoute = new Route({
      routeId: `route_reverse_${Date.now()}`,
      startPoint: {
        type: 'Point',
        name: endLocation,
        coordinates: [endPoint.lon, endPoint.lat]
      },
      endPoint: {
        type: 'Point',
        name: startLocation,
        coordinates: [startPoint.lon, startPoint.lat]
      },
      waypoints: waypoints.reverse().map(waypoint => ({
        type: 'Point',
        coordinates: [waypoint.lon, waypoint.lat]
      })), // Reverse the waypoints for the reverse route
      routePath: {
        type: 'LineString',
        coordinates: coordinates.reverse() // Reverse the coordinates for the reverse route
      },
      steps: steps.reverse(), // Reverse the steps for the reverse route
      distance: routeData.properties.legs[0].distance,
      time: routeData.properties.legs[0].time,
      createdAt: new Date()
    });

    await reverseRoute.save();

    res.status(200).json({ message: 'Route and reverse route saved successfully', route: newRoute, reverseRoute });

  } catch (error) {
    console.error('Error fetching route from Geoapify:', error);
    res.status(500).json({ message: 'Failed to fetch route', error: error.message });
  }
};

module.exports = { fetchAndStoreRoute, geocodeLocation };
