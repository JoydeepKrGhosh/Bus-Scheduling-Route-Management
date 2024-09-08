const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { employee_code, password } = req.body;

  try {
    // Find user by employee_code
    const user = await User.findOne({ employee_code });
    if (!user) {
      return res.status(401).json({ message: 'Invalid employee code or password' });
    }

    // Compare hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid employee code or password' });
    }

    // Create JWT payload
    const payload = { id: user._id, role: user.role };

    // Sign JWT Token
    const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1d' });

    // Respond with token and role for dashboard redirection
    res.status(200).json({ token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

