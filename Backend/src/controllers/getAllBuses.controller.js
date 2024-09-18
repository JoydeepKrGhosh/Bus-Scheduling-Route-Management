// src/controllers/bus.controller.js

const Bus = require('../models/bus.model.js'); // Assuming bus.model.js is where your Bus schema is defined

// Get all buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find(); // Fetch all buses from the database
    res.status(200).json(buses); // Send back all buses as JSON
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Failed to fetch buses' });
  }
};

module.exports = {
  getAllBuses,
};
