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
  status: {
    type: String,
    enum: ['available', 'on-duty', 'inactive'],
    default: 'available',
  },
});

const Conductor = mongoose.model('Conductor', conductorSchema);

module.exports = Conductor;
