const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  route_name: {
    type: String,
    required: true,
    unique: true,
  },
  stops: [{
    type: Schema.Types.ObjectId,
    ref: 'Stop',
  }],
  distance_km: {
    type: Number,
    required: true,
  },
  estimated_duration_minutes: {
    type: Number,
    required: true,
  },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
