const express = require('express');
const router = express.Router();
const JudgeController = require('../controllers/judge.controller');

router.post('/login', JudgeController.login);
router.get('/:judgeId/performances', JudgeController.getPerformancesToScore);
router.get('/', JudgeController.getAll);
router.get('/:id', JudgeController.getById);
router.post('/', JudgeController.create);
router.put('/:id', JudgeController.update);
router.delete('/:id', JudgeController.delete);

module.exports = router;
