const express = require('express');
const router = express.Router();
const RankingController = require('../controllers/ranking.controller');

router.get('/round/:roundId', RankingController.getRankingByRound);

module.exports = router;
