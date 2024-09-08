const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  bus_id: {
    type: Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  driver_id: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  conductor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Conductor',
    required: true,
  },
  route_id: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  schedule_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
});

const BusSchedule = mongoose.model('BusSchedule', scheduleSchema);

module.exports = BusSchedule;
