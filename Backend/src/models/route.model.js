const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
  routeId: { type: String, unique: true },
  startPoint: {
    name: String,
    coordinates: [Number]
  },
  endPoint: {
    name: String,
    coordinates: [Number]
  },
  waypoints: [
    {
      coordinates: [Number]
    }
  ],
  routePath: {
    type: {
      type: String,  // This defines the type of the GeoJSON object
      enum: ['LineString'],  // This ensures that only 'LineString' is allowed
      required: true
    },
    coordinates: {
      type: [[Number]],  // Array of arrays of numbers for lat/lon coordinates
      required: true
    }
  },
  steps: [
    {
      from_index: Number,
      to_index: Number,
      distance: Number,
      time: Number,
      instruction: String
    }
  ],
  distance: Number,
  time: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Route', RouteSchema);
