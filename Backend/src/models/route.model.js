const mongoose = require('mongoose');  

const stopSchema = new mongoose.Schema({  
  lat: { type: Number, required: true },  
  lon: { type: Number, required: true },  
  estimatedTimeToNextStop: { type: Number, required: true }, // Time in seconds  
});  

const routeSchema = new mongoose.Schema({  
  name: { type: String, required: true, unique: true }, // Unique name for the route  
  startLocation: { type: String, required: true },  
  endLocation: { type: String, required: true },  
  stops: [stopSchema], // Array of stops  
  totalDistance: { type: Number, required: true }, // Total distance in meters  
  totalTime: { type: Number, required: true }, // Total time in seconds  
});  

const Route = mongoose.model('Route', routeSchema);  

module.exports = Route;