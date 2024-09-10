const express = require('express');
const upload = require('../middlewares/awsMulterS3.js');
const { startDay, endDay } = require('../controllers/awsimage.controller.js');
const authMiddleware = require('../middlewares/jwtauth.middleware.js');

const router = express.Router();

// Route for uploading image at start of the day
router.post('/start-day', authMiddleware, upload.single('image'), startDay);

// Route for uploading image at end of the day
router.post('/end-day', authMiddleware, upload.single('image'), endDay);

module.exports = router;
