const express = require('express');
const router = express.Router();
const ScoreController = require('../controllers/score.controller');
router.post('/', ScoreController.createOrGet);
router.get('/performance/:performanceId/judge/:judgeId', ScoreController.getByPerformanceAndJudge);
router.put('/:scoreId', ScoreController.updateScore);

module.exports = router;
