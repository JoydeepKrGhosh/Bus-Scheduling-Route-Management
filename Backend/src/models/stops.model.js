const mongoose = require('mongoose');  

const stopSchema = new mongoose.Schema({  
  stopId: { type: String, required: true, unique: true },  
  name: { type: String, required: true }, 
  location: {  
    latitude: { type: Number, required: true },  
    longitude: { type: Number, required: true },  
  },  
});  

const Stop = mongoose.model('Stop', stopSchema);  

module.exports = Stop;