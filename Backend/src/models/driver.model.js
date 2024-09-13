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
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  employment_date: {
    type: Date,
    default: Date.now,
  },
  employeeCode: {
    type: String,
    required: true,
    unique: true,
  },
  referenceImageUrl: {
    type: String, // URL of the reference image
  },
  verificationStatus: {
    type: String, // Status of the image verification ('success' or 'failed')
  },
  lastVerifiedImage: {
    type: String, // URL of the last verified image
  },
  status: {
    type: String,
    enum: ['available', 'on-duty', 'inactive'],
    default: 'available',
  },
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
