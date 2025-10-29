const TeamModel = require('../models/team.model');

class TeamController {
    // GET /api/teams - Lấy tất cả đội
    static async getAll(req, res) {
        try {
            const teams = await TeamModel.getAll();
            res.json({
                success: true,
                data: teams,
                count: teams.length
            });
        } catch (error) {
            console.error('Error getting teams:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách đội',
                error: error.message
            });
        }
    }

    // GET /api/teams/:id - Lấy đội theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const team = await TeamModel.getById(id);

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đội'
                });
            }

            res.json({
                success: true,
                data: team
            });
        } catch (error) {
            console.error('Error getting team:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin đội',
                error: error.message
            });
        }
    }

    // POST /api/teams - Tạo đội mới
    static async create(req, res) {
        try {
            const { name } = req.body;

            // Validation
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin: name là bắt buộc'
                });
            }

            const newTeam = await TeamModel.create({ name });

            res.status(201).json({
                success: true,
                message: 'Tạo đội thành công',
                data: newTeam
            });
        } catch (error) {
            console.error('Error creating team:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo đội',
                error: error.message
            });
        }
    }

    // POST /api/teams/bulk - Tạo nhiều đội cùng lúc
    static async createBulk(req, res) {
        try {
            const { teams } = req.body;

            // Validation
            if (!teams || !Array.isArray(teams) || teams.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin: teams phải là mảng và không rỗng'
                });
            }

            // Validate từng team
            for (const team of teams) {
                if (!team.name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Mỗi đội phải có name'
                    });
                }
            }

            const newTeams = await TeamModel.createBulk(teams);

            res.status(201).json({
                success: true,
                message: `Tạo ${newTeams.length} đội thành công`,
                data: newTeams,
                count: newTeams.length
            });
        } catch (error) {
            console.error('Error creating teams in bulk:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo nhiều đội',
                error: error.message
            });
        }
    }

    // PUT /api/teams/:id - Cập nhật đội
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Kiểm tra đội có tồn tại không
            const exists = await TeamModel.exists(id);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đội'
                });
            }

            // Validation
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin: name là bắt buộc'
                });
            }

            const updated = await TeamModel.update(id, { name });

            res.json({
                success: true,
                message: 'Cập nhật đội thành công',
                data: updated
            });
        } catch (error) {
            console.error('Error updating team:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật đội',
                error: error.message
            });
        }
    }

    // DELETE /api/teams/:id - Xóa đội
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Kiểm tra đội có tồn tại không
            const exists = await TeamModel.exists(id);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đội'
                });
            }

            const deleted = await TeamModel.delete(id);

            if (deleted) {
                res.json({
                    success: true,
                    message: 'Xóa đội thành công'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Không thể xóa đội'
                });
            }
        } catch (error) {
            // Lỗi constraint (có performance liên quan)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    success: false,
                    message: 'Không thể xóa đội vì đã có tiết mục liên quan'
                });
            }

            console.error('Error deleting team:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa đội',
                error: error.message
            });
        }
    }
}

module.exports = TeamController;
