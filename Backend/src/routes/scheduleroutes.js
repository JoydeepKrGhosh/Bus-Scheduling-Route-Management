const express = require('express');
const busController = require('../controllers/generateschedule.js');

const router = express.Router();

router.post('/schedules', busController.createSchedule);

module.exports = router;