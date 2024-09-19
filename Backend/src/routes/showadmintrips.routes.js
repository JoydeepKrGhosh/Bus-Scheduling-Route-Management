const express = require('express');
const router = express.Router();
const TripAssignment = require('../models/tripassignment.model.js');

// Route for admin to view all trips or filter by date
router.get('/gettrips', async (req, res) => {
  const { selectedDate } = req.query; // Date can be passed as a query param

  try {
    // Create start and end of day for the selected date
    const startOfDay = new Date(selectedDate || new Date()); // If no date is selected, use the current day
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate || new Date());
    endOfDay.setHours(23, 59, 59, 999);

    let filter = {};

    // Add date filter to the query
    filter.startTime = { $gte: startOfDay, $lte: endOfDay };

    // Find and populate the trips for the driver or conductor
    const trips = await TripAssignment.find(filter)
      .populate('routeId', 'startPoint endPoint') // Populating route details including startPoint and endPoint
      .populate('driver_id', 'name') // Populating driver details (name)
      .populate('conductor_id', 'name') // Populating conductor details (name)
      .populate('busId', 'busNumber') // Populating bus details
      .exec();

    // Send response with the required fields, adding null checks
    res.status(200).json(trips.map(trip => ({
      driverName: trip.driver_id ? trip.driver_id.name : 'N/A', // Driver's name or 'N/A' if null
      conductorName: trip.conductor_id ? trip.conductor_id.name : 'N/A', // Conductor's name or 'N/A' if null
      busNumber: trip.busId ? trip.busId.busNumber : 'N/A', // Bus number or 'N/A' if null
      startPointName: trip.routeId && trip.routeId.startPoint ? trip.routeId.startPoint.name : 'N/A', // Start point name or 'N/A' if null
      endPointName: trip.routeId && trip.routeId.endPoint ? trip.routeId.endPoint.name : 'N/A', // End point name or 'N/A' if null
      startTime: trip.startTime, // Start time
      endTime: trip.endTime, // End time (if available)
      status: trip.status // Trip status
    })));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
