const express = require('express');
const router = express.Router();
const { addBus } = require('../controllers/addbus.controller.js');

// POST route to add a new bus
router.post('/add', addBus);

module.exports = router;
