const express = require('express');
const router = express.Router();
const PerformanceController = require('../controllers/performance.controller');
router.get('/', PerformanceController.getAll);
router.get('/:id', PerformanceController.getById);
router.post('/', PerformanceController.create);
router.put('/:id', PerformanceController.update);
router.delete('/:id', PerformanceController.delete);

module.exports = router;
