const mongoose = require('mongoose');  

const crewSchema = new mongoose.Schema({  
  crewId: { type: String, required: true, unique: true },  
  name: { type: String, required: true },  
  status: { type: String, required: true, enum: ['Available', 'On-duty', 'Rest'] },  
  experience: { type: Number, required: true },  
});  

const Crew = mongoose.model('Crew', crewSchema);  

module.exports = Crew;