const mongoose = require('mongoose');  
const Schema = mongoose.Schema;  

// PointSchema definition  
const PointSchema = new Schema({  
  type: {  
    type: String,  
    enum: ['Point'], // Only allow 'Point' as the type  
    required: true  
  },  
  name: { // Add name property  
    type: String, // Optional name for the point  
    required: false // Make it optional  
  },  
  coordinates: {  
    type: [Number], // Array of numbers for longitude and latitude  
    required: true  
  }  
});  

// RouteSchema definition  
const RouteSchema = new Schema({  
  routeId: { type: String, unique: true },  
  startPoint: {  
    type: PointSchema, // Reference the PointSchema  
    required: true  
  },  
  endPoint: {  
    type: PointSchema, // Reference the PointSchema  
    required: true  
  },  
  waypoints: [PointSchema], // Use the PointSchema for waypoints  
  routePath: {  
    type: {  
      type: String, // This defines the type of the GeoJSON object  
      enum: ['LineString'], // This ensures that only 'LineString' is allowed  
      required: true  
    },  
    coordinates: {  
      type: [[Number]], // Array of arrays of numbers for lat/lon coordinates  
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
  },  
  isAssigned: {  
    type: Boolean,  
    default: false  
  }  
});  

// Create 2dsphere indexes for geospatial queries  
RouteSchema.index({ routePath: '2dsphere' });   
RouteSchema.index({ 'startPoint.coordinates': '2dsphere' }); // Index for startPoint  
RouteSchema.index({ 'endPoint.coordinates': '2dsphere' });   // Index for endPoint  

module.exports = mongoose.model('Route', RouteSchema);