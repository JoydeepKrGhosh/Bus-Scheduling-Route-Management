// routes/driverRoutes.js
const express = require('express');
const { register, login, logout, getAllDrivers } = require('../controllers/driver.controller');
const authenticateDriver = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/alldrivers', getAllDrivers);



module.exports = router;