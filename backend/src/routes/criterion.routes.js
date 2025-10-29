const express = require('express');
const router = express.Router();
const CriterionController = require('../controllers/criterion.controller');

router.get('/', CriterionController.getAll);
router.get('/:id', CriterionController.getById);

module.exports = router;
