const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const WorkHistory = require('../models/workhistory.model.js');
const Stop = require('../models/stops.model.js');

const router = express.Router();

// Track Bus Location and Verify Stops
router.post('/track-location', authMiddleware, async (req, res) => {
  const { workHistoryId, currentLocation } = req.body; // currentLocation is an object { lat: Number, lng: Number }

  try {
    // Find the work history and route
    const workHistory = await WorkHistory.findById(workHistoryId).populate('route_id');
    if (!workHistory) {
      return res.status(404).json({ message: 'Work history not found' });
    }

    // Get the stops for the route and sort by their order
    const routeStops = await Stop.find({ route_id: workHistory.route_id._id }).sort({ order: 1 });

    // Find the closest stop (within 500 meters)
    const closestStop = routeStops.find(stop => {
      const distance = calculateDistance(currentLocation, stop.location);
      return distance < 0.5; // Distance is calculated in kilometers, so 0.5 km is 500 meters
    });

    if (closestStop) {
      return res.status(200).json({ message: 'Bus is near stop', stop: closestStop });
    } else {
      return res.status(400).json({ message: 'Bus is off the route' });
    }
  } catch (error) {
    console.error('Error tracking location:', error);
    res.status(500).json({ message: 'Server error tracking location', error });
  }
});

// Helper function to calculate distance between two geo-locations (Haversine Formula)
function calculateDistance(loc1, loc2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  
  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance; 
}

module.exports = router;
