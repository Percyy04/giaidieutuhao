const express = require('express');
const createRequire = require('module').createRequire;
const require = createRequire(import.meta.url);
const AdminController = require('../controllers/admin.controller.js');
const router = express.Router();

router.get("/rounds", AdminController.getRounds);
router.post("/rounds", AdminController.createRound);

export default router;
