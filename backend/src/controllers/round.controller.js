const RoundModel = require('../models/round.model');
const RoundOrganizationModel = require('../models/round-organization.model');
const {connection} = require("../config/db");

class RoundController {
    // GET /api/rounds - Lấy tất cả vòng thi
    static async getAll(req, res) {
        try {
            const { org_id } = req.query;
            let sql = 'SELECT r.id, r.name FROM round r';
            const params = [];

            if (org_id) {
                sql += ' JOIN round_organization ro ON ro.round_id = r.id WHERE ro.org_id = ?';
                params.push(org_id);
            }

            const [rows] = await connection.query(sql, params);
            res.json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách vòng thi', error: error.message });
        }
    }

    // GET /api/rounds/:id - Lấy vòng thi theo ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const round = await RoundModel.getById(id);

            if (!round) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy vòng thi'
                });
            }

            res.json({
                success: true,
                data: round
            });
        } catch (error) {
            console.error('Error getting round:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin vòng thi',
                error: error.message
            });
        }
    }

    // POST /api/rounds - Tạo vòng thi mới
    static async create(req, res) {
        try {
            const { name, org_ids } = req.body;

            // Validation
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin: name là bắt buộc'
                });
            }

            const newRound = await RoundModel.create({ name });

            // Nếu có danh sách đơn vị, phân công luôn
            if (org_ids && Array.isArray(org_ids) && org_ids.length > 0) {
                await RoundOrganizationModel.assignMultiple(newRound.id, org_ids);
                // Lấy lại round với thông tin organizations
                const roundWithOrgs = await RoundModel.getById(newRound.id);
                return res.status(201).json({
                    success: true,
                    message: 'Tạo vòng thi thành công',
                    data: roundWithOrgs
                });
            }

            res.status(201).json({
                success: true,
                message: 'Tạo vòng thi thành công',
                data: newRound
            });
        } catch (error) {
            console.error('Error creating round:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo vòng thi',
                error: error.message
            });
        }
    }

    // PUT /api/rounds/:id - Cập nhật vòng thi
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Kiểm tra vòng thi có tồn tại không
            const exists = await RoundModel.exists(id);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy vòng thi'
                });
            }

            // Validation
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin: name là bắt buộc'
                });
            }

            const updated = await RoundModel.update(id, { name });

            res.json({
                success: true,
                message: 'Cập nhật vòng thi thành công',
                data: updated
            });
        } catch (error) {
            console.error('Error updating round:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật vòng thi',
                error: error.message
            });
        }
    }

    // DELETE /api/rounds/:id - Xóa vòng thi
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Kiểm tra vòng thi có tồn tại không
            const exists = await RoundModel.exists(id);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy vòng thi'
                });
            }

            const deleted = await RoundModel.delete(id);

            if (deleted) {
                res.json({
                    success: true,
                    message: 'Xóa vòng thi thành công'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Không thể xóa vòng thi'
                });
            }
        } catch (error) {
            // Lỗi constraint (có performance hoặc score liên quan)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    success: false,
                    message: 'Không thể xóa vòng thi vì đã có tiết mục hoặc điểm chấm liên quan'
                });
            }

            console.error('Error deleting round:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa vòng thi',
                error: error.message
            });
        }
    }

    // POST /api/rounds/:id/organizations - Phân công đơn vị vào vòng
    static async assignOrganizations(req, res) {
        try {
            const { id } = req.params;
            const { org_ids } = req.body;

            // Validation
            if (!org_ids || !Array.isArray(org_ids) || org_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin: org_ids phải là mảng và không rỗng'
                });
            }

            // Kiểm tra vòng thi có tồn tại không
            const exists = await RoundModel.exists(id);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy vòng thi'
                });
            }

            const assignments = await RoundOrganizationModel.assignMultiple(id, org_ids);

            res.json({
                success: true,
                message: `Đã phân công ${assignments.length} đơn vị vào vòng thi`,
                data: assignments
            });
        } catch (error) {
            console.error('Error assigning organizations:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi phân công đơn vị',
                error: error.message
            });
        }
    }

    // DELETE /api/rounds/:id/organizations/:orgId - Hủy phân công
    static async unassignOrganization(req, res) {
        try {
            const { id, orgId } = req.params;

            const unassigned = await RoundOrganizationModel.unassign(id, orgId);

            if (unassigned) {
                res.json({
                    success: true,
                    message: 'Hủy phân công thành công'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy phân công này'
                });
            }
        } catch (error) {
            console.error('Error unassigning organization:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi hủy phân công',
                error: error.message
            });
        }
    }

    // GET /api/rounds/:id/organizations - Lấy danh sách đơn vị được phân công
    static async getOrganizations(req, res) {
        try {
            const { id } = req.params;

            const organizations = await RoundOrganizationModel.getOrganizationsByRound(id);

            res.json({
                success: true,
                data: organizations,
                count: organizations.length
            });
        } catch (error) {
            console.error('Error getting organizations:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách đơn vị',
                error: error.message
            });
        }
    }
}

module.exports = RoundController;
