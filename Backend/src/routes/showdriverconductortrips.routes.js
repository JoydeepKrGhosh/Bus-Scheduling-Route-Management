const express = require('express');
const router = express.Router();
const TripAssignment = require('../models/tripassignment.model.js'); // Import the TripAssignment model

// Route for driver/conductor to get their schedule
router.get('/crewschedule/:role/:id', async (req, res) => {
  const { role, id } = req.params;
  const { selectedDate } = req.query; // Date can be passed as a query param

  try {
    // Create start and end of day for the selected date
    const startOfDay = new Date(selectedDate || new Date()); // If no date is selected, use the current day
    startOfDay.setHours(0, 0, 0, 0); // Set time to the start of the day (00:00:00)

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59)

    let filter = {};

    // Set filter based on the role
    if (role === 'driver') {
      filter.driver_id = id; // Filter by driver ID
    } else if (role === 'conductor') {
      filter.conductor_id = id; // Filter by conductor ID
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Add date filter based on the trip's scheduled start time
    filter.scheduledStartTime = { $gte: startOfDay, $lte: endOfDay };

    // Find and populate the trips for the driver or conductor
    const trips = await TripAssignment.find(filter)
      .populate('routeId', 'startPoint endPoint') // Populate route details (startPoint and endPoint)
      .populate('driver_id', 'name') // Populate driver details (name)
      .populate('conductor_id', 'name') // Populate conductor details (name)
      .populate('busId', 'busNumber') // Populate bus details (busNumber)
      .exec();

    // Send response with the required fields, adding null checks
    res.status(200).json(trips.map(trip => ({
      driverName: trip.driver_id ? trip.driver_id.name : 'N/A', // Driver's name or 'N/A' if null
      conductorName: trip.conductor_id ? trip.conductor_id.name : 'N/A', // Conductor's name or 'N/A' if null
      busNumber: trip.busId ? trip.busId.busNumber : 'N/A', // Bus number or 'N/A' if null
      startPointName: trip.routeId && trip.routeId.startPoint ? trip.routeId.startPoint.name : 'N/A', // Start point name or 'N/A' if null
      endPointName: trip.routeId && trip.routeId.endPoint ? trip.routeId.endPoint.name : 'N/A', // End point name or 'N/A' if null
      scheduledStartTime: trip.scheduledStartTime, // Scheduled start time
      scheduledEndTime: trip.scheduledEndTime || 'N/A', // Scheduled end time or 'N/A' if not available
      actualStartTime: trip.actualStartTime || 'N/A', // Actual start time or 'N/A' if not started
      actualEndTime: trip.actualEndTime || 'N/A', // Actual end time or 'N/A' if not completed
      status: trip.status // Trip status (scheduled, completed, etc.)
    })));
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
