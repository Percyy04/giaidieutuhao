const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team.controller');

// POST /api/teams/bulk - Tạo nhiều đội (phải đặt trước /:id)
router.post('/bulk', TeamController.createBulk);

// GET /api/teams - Lấy tất cả
router.get('/', TeamController.getAll);

// GET /api/teams/:id - Lấy theo ID
router.get('/:id', TeamController.getById);

// POST /api/teams - Tạo mới
router.post('/', TeamController.create);

// PUT /api/teams/:id - Cập nhật
router.put('/:id', TeamController.update);

// DELETE /api/teams/:id - Xóa
router.delete('/:id', TeamController.delete);

module.exports = router;
