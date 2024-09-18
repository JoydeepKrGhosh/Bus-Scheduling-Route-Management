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

// Function to fetch route from Geoapify and store it in MongoDB  
const fetchAndStoreRoute = async (req, res) => {  
  const { startPointName, endPointName } = req.body; // Assuming you'll pass names instead  

  try {  
    // Geocode start and end locations to get their coordinates  
    const startPoint = await geocodeLocation(startPointName);  
    const endPoint = await geocodeLocation(endPointName);  

    // Make a request to Geoapify to get the route between two points  
    const geoapifyResponse = await axios.get('https://api.geoapify.com/v1/routing', {  
      params: {  
        apiKey: process.env.GEOAPIFY_API_KEY,  
        waypoints: `${startPoint.lat},${startPoint.lon}|${endPoint.lat},${endPoint.lon}`,  
        mode: 'bus' // mode of transport  
      }  
    });  

    const routeData = geoapifyResponse.data.features[0]; // Extract the feature from the response  

    // Extract coordinates for the entire route from the geometry section  
    const coordinates = routeData.geometry.coordinates[0]; // Assuming the first array in MultiLineString  

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

    // Create a new route document for MongoDB  
    const newRoute = new Route({  
      routeId: `route_${Date.now()}`, // unique identifier  
      startPoint: {  
        name: startPointName, // Using the original location name  
        coordinates: [startPoint.lon, startPoint.lat]  
      },  
      endPoint: {  
        name: endPointName, // Using the original location name  
        coordinates: [endPoint.lon, endPoint.lat]  
      },  
      waypoints, // Waypoints for the route  
      routePath: {  
        type: 'LineString', // GeoJSON LineString for the route  
        coordinates  
      },  
      steps, // Detailed steps for navigation  
      distance: routeData.properties.legs[0].distance, // Total distance  
      time: routeData.properties.legs[0].time, // Total time  
      createdAt: new Date() // Timestamp  
    });  

    // Save the route to MongoDB  
    await newRoute.save();  

    res.status(200).json({ message: 'Route saved successfully', route: newRoute });  
  } catch (error) {  
    console.error('Error fetching route from Geoapify:', error);  
    res.status(500).json({ message: 'Failed to fetch route', error: error.message });  
  }  
};  

module.exports = { fetchAndStoreRoute, geocodeLocation };