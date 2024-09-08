const express = require('express');
const authMiddleware = require('../middlewares/jwtauth.middleware.js');
const roleRedirect = require('../middlewares/login.middlewares.js');

const router = express.Router();

// Login Success Route (This route handles redirection based on role)
router.get('/dashboard', authMiddleware, roleRedirect);

// Admin Dashboard Route
router.get('/admin/dashboard', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

// Crew Dashboard Route
router.get('/crew/dashboard', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the Crew Dashboard' });
});

module.exports = router;
