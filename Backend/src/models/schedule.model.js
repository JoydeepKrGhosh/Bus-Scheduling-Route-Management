const mongoose = require('mongoose');  

const scheduleSchema = new mongoose.Schema({  
  scheduleId: { type: String, required: true, unique: true },  
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },  
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },  
  crewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew', required: true },  
  startTime: { type: Date, required: true },  
  endTime: { type: Date, required: true },  
  type: { type: String, required: true, enum: ['Linked', 'Unlinked'] },  
});  

const Schedule = mongoose.model('Schedule', scheduleSchema);  

module.exports = Schedule; 