const mongoose = require('mongoose');

const TripAssignmentSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  conductorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  expectedEndTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  startLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      //required: true
    }
  },
  endLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      //required: true
    }
  },
  tripSequence: {
    type: Number,
    default: 0
  }
});

TripAssignmentSchema.index({ startLocation: '2dsphere' });
TripAssignmentSchema.index({ endLocation: '2dsphere' });

const TripAssignment = mongoose.model('TripAssignment', TripAssignmentSchema);
module.exports = TripAssignment;

