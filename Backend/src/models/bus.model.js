const mongoose = require('mongoose');  

const busSchema = new mongoose.Schema({  
  busId: { type: String, required: true, unique: true },  
  capacity: { type: Number, required: true },  
  type: { type: String, required: true },  
  status: { type: String, required: true, enum: ['Available', 'In-service', 'Maintenance'] },  
  location: {  
    latitude: { type: Number, required: true },  
    longitude: { type: Number, required: true },  
  },  
});  

const Bus = mongoose.model('Bus', busSchema);  

module.exports = Bus;  
