// controllers/routeController.js

const Route = require('../models/route.model.js');

// Get all routes with start and end points only
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({}, 'routeId startPoint endPoint');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get details of a specific route by ID
exports.getRouteById = async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const route = await Route.findOne({ routeId });

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
