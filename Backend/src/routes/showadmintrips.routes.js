const express = require('express');
const router = express.Router();
const TripAssignment = require('../models/tripassignment.model.js');

// Route for admin to view all trips or filter by selected date
router.get('/gettrips', async (req, res) => {
  const { selectedDate } = req.query; // Date passed as a query param from the dashboard

  try {
    // If selectedDate is provided, use it; otherwise, default to the current day
    const startOfDay = new Date(selectedDate || new Date());
    startOfDay.setHours(0, 0, 0, 0); // Set time to the beginning of the selected day (00:00:00)

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the selected day (23:59:59)

    let filter = {};

    // Apply the date filter for the trip's scheduled start time
    filter.scheduledStartTime = { $gte: startOfDay, $lte: endOfDay };

    // Find and populate the trips for driver, conductor, bus, and route
    const trips = await TripAssignment.find(filter)
      .populate('routeId', 'startPoint endPoint') // Populate route details
      .populate('driver_id', 'name') // Populate driver details
      .populate('conductor_id', 'name') // Populate conductor details
      .populate('busId', 'busNumber') // Populate bus details
      .exec();

    // Send response with the required fields
    res.status(200).json(trips.map(trip => ({
      driverName: trip.driver_id ? trip.driver_id.name : 'N/A', // Driver's name or 'N/A' if null
      conductorName: trip.conductor_id ? trip.conductor_id.name : 'N/A', // Conductor's name or 'N/A' if null
      busNumber: trip.busId ? trip.busId.busNumber : 'N/A', // Bus number or 'N/A' if null
      startPointName: trip.routeId && trip.routeId.startPoint ? trip.routeId.startPoint.name : 'N/A', // Start point name or 'N/A' if null
      endPointName: trip.routeId && trip.routeId.endPoint ? trip.routeId.endPoint.name : 'N/A', // End point name or 'N/A' if null
      scheduledStartTime: trip.scheduledStartTime, // Scheduled start time
      scheduledEndTime: trip.scheduledEndTime || 'N/A', // Scheduled end time or 'N/A' if not ended
      actualStartTime: trip.actualStartTime || 'N/A', // Actual start time or 'N/A' if not started
      actualEndTime: trip.actualEndTime || 'N/A', // Actual end time or 'N/A' if not completed
      status: trip.status // Trip status
    })));
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
