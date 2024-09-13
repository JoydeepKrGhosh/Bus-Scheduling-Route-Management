require('dotenv').config(); // Load environment variables  
const axios = require('axios');  
const Route = require('../models/route.model.js'); // Import the Route model  

// Get Coordinates based on location  
const getCoordinates = async (location) => {  
  const apiKey = process.env.GEOAPIFY_API_KEY; // Use API key from .env  
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;  
  
  try {  
    const response = await axios.get(url);  
    const coordinates = response.data.features[0].geometry.coordinates;  
    return { lat: coordinates[1], lon: coordinates[0] }; // Return latitude and longitude  
  } catch (error) {  
    console.error(`Error getting coordinates for ${location}:`, error);  
    return null;  
  }  
};  

// Fetch route between start and end coordinates  
const fetchRoute = async (startCoords, endCoords) => {  
  const apiKey = process.env.GEOAPIFY_API_KEY; // Use API key from .env  
  const url = `https://api.geoapify.com/v1/routing?waypoints=${startCoords.lat},${startCoords.lon}|${endCoords.lat},${endCoords.lon}&mode=transit&apiKey=${apiKey}`;  

  try {  
    const response = await axios.get(url);  
    const routeData = response.data;  
    return routeData; // Return the route data  
  } catch (error) {  
    console.error('Error fetching route:', error);  
    return null;  
  }  
};  

// Controller function to generate and store the route  
const generateRoute = async (req, res) => {  
  const { startLocation, endLocation, routeName } = req.body;  

  if (!startLocation || !endLocation || !routeName) {  
    return res.status(400).json({ error: 'Start location, end location, and route name are required' });  
  }  

  try {  
    // Get start and end coordinates  
    const startCoords = await getCoordinates(startLocation);  
    const endCoords = await getCoordinates(endLocation);  

    if (startCoords && endCoords) {  
      // Fetch the route data  
      const routeData = await fetchRoute(startCoords, endCoords);  

      if (routeData && routeData.routes) {  
        const route = routeData.routes[0]; // Assuming you want the first route  
        const totalDistance = route.distance; // Total distance in meters  
        const totalTime = route.duration; // Total time in seconds  

        const stops = route.legs.reduce((acc, leg) => {  
          leg.steps.forEach((step) => {  
            const [lon, lat] = step.start_location;  
            const estimatedTimeToNextStop = step.duration; // Estimated time for this segment  
            acc.push({ lat, lon, estimatedTimeToNextStop });  
          });  
          return acc;  
        }, []);  

        // Save the route in the database  
        const newRoute = new Route({  
          name: routeName, // Unique name for the route  
          startLocation,  
          endLocation,  
          stops, // Store the stops with coordinates and estimated times  
          totalDistance, // Total distance in meters  
          totalTime, // Total time in seconds  
        });  

        await newRoute.save();  

        return res.json({ message: 'Route generated and saved successfully', route: newRoute });  
      } else {  
        return res.status(500).json({ error: 'Error fetching route data' });  
      }  
    } else {  
      return res.status(500).json({ error: 'Unable to get coordinates for the provided locations' });  
    }  
  } catch (error) {  
    return res.status(500).json({ error: 'An error occurred while generating the route' });  
  }  
};  

module.exports = {  
  generateRoute,  
};