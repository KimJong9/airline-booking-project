const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// 사용자 정보 검색 API

router.get('/flights',flightController.getFlightsInfo);
router.get('/countries', flightController.getCountries);
router.get('/cities/:country_name', flightController.getCities);
router.get('/airports/:country_name/:city_name', flightController.getAirports);

module.exports = router;
