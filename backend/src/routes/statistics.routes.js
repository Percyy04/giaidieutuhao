const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statistics.controller');

router.get('/round/:roundId', StatisticsController.getRoundStatistics);

module.exports = router;
