// src/routes/trip.routes.js

const express = require('express');
const router = express.Router();
const { getFilteredTrips } = require('../controllers/getTrips.controller.js');

// Route to get filtered trips
router.get('/filtertrips', getFilteredTrips);

module.exports = router;

