const express = require('express');
const router = express.Router();
const { scheduleDailyTrips } = require('../controllers/assigntrip.controller.js');

router.post('/api/schedule-trips', scheduleDailyTrips);


module.exports = router;
