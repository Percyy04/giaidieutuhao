const JudgeModel = require('../models/judge.model');

class JudgeController {
    // POST /api/judges/login
    static async login(req, res) {
        try {
            const { email, org_id } = req.body;
            if (!email || !org_id) {
                return res.status(400).json({ success: false, message: 'Thiếu email hoặc org_id' });
            }
            const judge = await JudgeModel.login(email, org_id);
            if (!judge) {
                return res.status(404).json({ success: false, message: 'Email hoặc đơn vị không đúng' });
            }
            res.json({ success: true, message: 'Đăng nhập thành công', data: judge });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi đăng nhập', error: error.message });
        }
    }

    // GET /api/judges/:judgeId/performances
    static async getPerformancesToScore(req, res) {
        try {
            const { judgeId } = req.params;
            const performances = await JudgeModel.getPerformancesToScore(judgeId);
            res.json({ success: true, data: performances });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tiết mục', error: error.message });
        }
    }

    // CRUD
    static async getAll(req, res) {
        try {
            const data = await JudgeModel.getAll();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi lấy danh sách judge', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const judge = await JudgeModel.getById(id);
            if (!judge) return res.status(404).json({ success: false, message: 'Không tìm thấy judge' });
            res.json({ success: true, data: judge });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { org_id, full_name, email } = req.body;
            if (!org_id || !full_name || !email) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
            }
            const data = await JudgeModel.create({ org_id, full_name, email });
            res.status(201).json({ success: true, message: 'Tạo judge thành công', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi tạo judge', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { org_id, full_name, email } = req.body;
            const exists = await JudgeModel.exists(id);
            if (!exists) return res.status(404).json({ success: false, message: 'Không tìm thấy judge' });
            const data = await JudgeModel.update(id, { org_id, full_name, email });
            res.json({ success: true, message: 'Cập nhật thành công', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const exists = await JudgeModel.exists(id);
            if (!exists) return res.status(404).json({ success: false, message: 'Không tìm thấy judge' });
            await JudgeModel.delete(id);
            res.json({ success: true, message: 'Đã xóa judge' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi xóa judge', error: error.message });
        }
    }
}

module.exports = JudgeController;
