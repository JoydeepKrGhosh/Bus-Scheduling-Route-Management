const express = require('express');
const { uploadReferenceImage, uploadDailyImageAndVerify } = require('../controllers/awsimage.controller.js');
const router = express.Router();

router.post('/upload-reference-image', uploadReferenceImage);
router.post('/upload-daily-image', uploadDailyImageAndVerify);

module.exports = router;

