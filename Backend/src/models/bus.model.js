const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const busSchema = new Schema({
  bus_number: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'maintenance', 'in-service', 'inactive'],
    default: 'available',
  },
  route_id: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
  },
  last_maintenance_date: {
    type: Date,
  },
  assigned_driver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
  },
  assigned_conductor: {
    type: Schema.Types.ObjectId,
    ref: 'Conductor',
  },
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
