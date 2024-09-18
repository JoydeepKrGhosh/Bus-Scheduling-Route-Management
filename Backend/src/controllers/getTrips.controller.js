// src/controllers/trip.controller.js

const TripAssignment = require('../models/tripassignment.model.js'); // Import the TripAssignment model

// Controller to fetch trips based on filters (date, driverId, conductorId)
const getFilteredTrips = async (req, res) => {
  try {
    // Extract query parameters
    const { date, driverId, conductorId } = req.query;

    // Build query object
    const query = {};

    // Filter by driverId if provided
    if (driverId) {
      query.driverId = driverId;
    }

    // Filter by conductorId if provided
    if (conductorId) {
      query.conductorId = conductorId;
    }

    // Filter by date if provided (date matching for startTime or other fields)
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // Set endDate to the next day to cover the full day range

      query.startTime = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // Execute the query with filters
    const trips = await TripAssignment.find(query)
      .populate('routeId', 'routeName') // Populate route details
      .populate('driverId', 'name') // Populate driver details
      .populate('conductorId', 'name') // Populate conductor details
      .populate('busId', 'busNumber') // Populate bus details
      .exec();

    // Respond with the filtered trips
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

module.exports = {
  getFilteredTrips,
};
