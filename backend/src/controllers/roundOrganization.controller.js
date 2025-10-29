const RoundOrganizationModel = require('../models/roundOrganization.model');

class RoundOrganizationController {
    static async assign(req, res) {
        try {
            const { round_id, org_id } = req.body;
            if (!round_id || !org_id) {
                return res.status(400).json({ success: false, message: 'Thiếu round_id hoặc org_id' });
            }
            const assigned = await RoundOrganizationModel.assign(round_id, org_id);
            if (assigned) {
                res.status(201).json({ success: true, message: 'Phân công thành công' });
            } else {
                res.json({ success: true, message: 'Đã tồn tại phân công này' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi phân công', error: error.message });
        }
    }

    static async remove(req, res) {
        try {
            const { round_id, org_id } = req.body;
            if (!round_id || !org_id) {
                return res.status(400).json({ success: false, message: 'Thiếu round_id hoặc org_id' });
            }
            const removed = await RoundOrganizationModel.remove(round_id, org_id);
            if (removed) {
                res.json({ success: true, message: 'Đã xóa phân công' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy phân công' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa', error: error.message });
        }
    }

    static async getByRound(req, res) {
        try {
            const { roundId } = req.params;
            const data = await RoundOrganizationModel.getByRound(roundId);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }
}

module.exports = RoundOrganizationController;
