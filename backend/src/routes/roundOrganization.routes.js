const express = require('express');
const router = express.Router();
const RoundOrganizationController = require('../controllers/roundOrganization.controller');

router.post('/', RoundOrganizationController.assign);
router.delete('/', RoundOrganizationController.remove);
router.get('/round/:roundId', RoundOrganizationController.getByRound);

module.exports = router;
