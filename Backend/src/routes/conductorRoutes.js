// routes/conductorRoutes.js  
const express = require('express');
const { registerConductor,getAllConductors } = require('../controllers/conductor.controller.js');
const router = express.Router();

router.post('/register', registerConductor);
router.get('/allconductor', getAllConductors);
/*
router.post('/login', login);
router.post('/logout', logout); */

module.exports = router; 