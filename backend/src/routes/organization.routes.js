const express = require('express');
const router = express.Router();
const OrganizationController = require('../controllers/organization.controller');

router.get('/', OrganizationController.getAll);
router.get('/:id', OrganizationController.getById);
router.post('/', OrganizationController.create);
router.put('/:id', OrganizationController.update);
router.delete('/:id', OrganizationController.delete);

module.exports = router;
