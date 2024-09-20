const mongoose = require('mongoose');

const TripAssignmentSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  conductor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  
  // Scheduled times during trip planning
  scheduledStartTime: {
    type: Date,
    required: true // To ensure it is set during scheduling
  },
  scheduledEndTime: {
    type: Date,
    required: true // To ensure it is set during scheduling
  },
  
  // Actual times when the trip starts/ends
  actualStartTime: {
    type: Date // Will be set when the trip starts
  },
  actualEndTime: {
    type: Date // Will be set when the trip ends
  },

  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed'],
    default: 'scheduled' // Initial status will be scheduled
  },

  startLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  endLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
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
