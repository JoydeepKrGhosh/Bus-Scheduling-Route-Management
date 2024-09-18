const Bus = require('../models/bus.model.js');

// Controller to add a new bus
const addBus = async (req, res) => {
  try {
    const { busNumber, capacity, status, assignedRoute } = req.body;

    // Create a new bus instance
    const newBus = new Bus({
      busNumber,
      capacity,
      status,
      assignedRoute
    });

    // Save the new bus to the database
    await newBus.save();

    return res.status(201).json({ message: 'Bus added successfully!', bus: newBus });
  } catch (error) {
    console.error('Error adding bus:', error);
    return res.status(500).json({ message: 'Error adding bus', error });
  }
};

module.exports = { addBus };
