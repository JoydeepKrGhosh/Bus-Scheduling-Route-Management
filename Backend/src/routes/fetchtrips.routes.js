const express = require('express');
const router = express.Router();
const TripAssignment = require('../models/TripAssignment');

// Get all trip assignments (optionally filter by driver, conductor, or bus)
router.get('/assignments', async (req, res) => {
  try {
    const assignments = await TripAssignment.find({})
      .populate('driverId')
      .populate('conductorId')
      .populate('busId')
      .populate('routeId');
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching trip assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
