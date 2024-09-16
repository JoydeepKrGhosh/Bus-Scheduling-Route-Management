const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conductorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  conductor_id: {
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
  availability: {
    type: String,
    enum: ['available', 'assigned', 'on-leave'],
    default: 'available'
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }
});

const Conductor = mongoose.model('Conductor', conductorSchema);

module.exports = Conductor;
