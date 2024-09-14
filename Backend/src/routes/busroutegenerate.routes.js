const express = require('express');  
const { fetchAndStoreRoute } = require('../controllers/busroutegenerate.controller.js'); // Adjust the path as necessary  
const router = express.Router();  

// Define the route for fetching and storing the route  
router.post('/api/generateroute', fetchAndStoreRoute); // POST request to /api/routes  

module.exports = router;