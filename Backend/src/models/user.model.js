const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  employee_code: {
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
    required: true,
  },
  role: {
    type: String,
    enum: ['driver', 'conductor', 'admin'],
    required: true,
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor',
  }, 
  startDayImageKey: {
    type: String, // Stores the S3 key for the start day image
    default: null
  },
  // You can also add an endDayImageKey if you want to store the end-day image separately
  
  endDayImageKey: {
    type: String,
    default: null
  },
});

userSchema.pre('save', async function (next) {
  // If the password field is modified or new, hash the password
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
