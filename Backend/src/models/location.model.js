const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: {
    latitude: Number,
    longitude: Number,
  }
});
const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;