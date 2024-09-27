const express = require('express');
const router = express.Router();
const bookingController  = require('../controllers/bookingController');

// POST request to create a booking
router.post('/', bookingController.booking);
router.get('/getInfo/:username', bookingController.getInfo);

module.exports = router;
