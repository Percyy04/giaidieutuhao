const express = require('express');
const router = express.Router();
const RoundController = require('../controllers/round.controller');

router.get('/', RoundController.getAll);
router.get('/:id', RoundController.getById);
router.post('/', RoundController.create);
router.put('/:id', RoundController.update);
router.delete('/:id', RoundController.delete);

module.exports = router;
