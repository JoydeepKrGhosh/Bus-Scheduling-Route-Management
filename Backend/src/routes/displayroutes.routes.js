// routes/routes.js

const express = require('express');
const router = express.Router();
const routeController = require('../controllers/displayroutes.controller.js');

// Route to fetch all routes with start and end points
router.get('/routes', routeController.getRoutes);

// Route to fetch a specific route by ID
router.get('/route/:routeId', routeController.getRouteById);

module.exports = router;
