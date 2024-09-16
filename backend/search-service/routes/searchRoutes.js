const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// 사용자 정보 검색 API
router.get('/user/:username', searchController.getUserInfo);
router.get('/flights',searchController.getFlightsInfo);

module.exports = router;
