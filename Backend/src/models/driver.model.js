const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  driver_id: {
    type: String,
    required: true,
    unique: true,
  },
  license_number: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  employment_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['available', 'on-duty', 'inactive'],
    default: 'available',
  },
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
