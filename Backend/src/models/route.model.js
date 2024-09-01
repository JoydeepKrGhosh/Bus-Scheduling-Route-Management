const mongoose = require('mongoose');  

const routeSchema = new mongoose.Schema({  
  routeId: { type: String, required: true, unique: true },  
  name: { type: String, required: true },  
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true }],  
  distance: { type: Number, required: true },  
  duration: { type: Number, required: true },  
});  

const Route = mongoose.model('Route', routeSchema);  

module.exports = Route;