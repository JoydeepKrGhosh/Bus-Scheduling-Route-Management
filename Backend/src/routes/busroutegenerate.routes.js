const express = require('express');  
const { generateRoute } = require('../controllers/busroutegenerate.controller.js'); // Adjust the path as needed  

const router = express.Router();  

// POST route for generating a new route  
router.post('/generate', generateRoute);  

module.exports = router;