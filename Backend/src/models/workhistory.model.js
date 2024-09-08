const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workHistorySchema = new Schema({
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
    ref: 'Route', // Assuming there's a Route model
    required: true,
  },
  assignment_date: {
    type: Date,
    required: true,
  },
  work_duration_hours: {
    type: Number,
    required: true,
  },
  completion_status: {
    type: String,
    enum: ['completed', 'incomplete', 'ongoing'],
    default: 'ongoing',
  },
});

const WorkHistory = mongoose.model('WorkHistory', workHistorySchema);

module.exports = WorkHistory;
