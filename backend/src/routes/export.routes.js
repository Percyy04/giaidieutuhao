const express = require('express');
const router = express.Router();
const ExportController = require('../controllers/export.controller');

router.get('/round/:roundId', ExportController.exportRankingCSV);

module.exports = router;
