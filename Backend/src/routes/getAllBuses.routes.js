// src/routes/bus.routes.js

const express = require('express');
const router = express.Router();
const { getAllBuses } = require('../controllers/getAllBuses.controller.js'); // Import the getAllBuses controller

// Route to get all buses
router.get('/getbuses', getAllBuses);

module.exports = router;
