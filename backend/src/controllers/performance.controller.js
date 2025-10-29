const PerformanceModel = require('../models/performance.model');
class PerformanceController {
    static async getAll(req, res) {
        try {
            const { round_id } = req.query;
            const data = await PerformanceModel.getAll({ round_id });
            res.json({ success: true, data, count: data.length });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tiết mục', error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const perf = await PerformanceModel.getById(id);
            if (!perf)
                return res.status(404).json({ success: false, message: 'Không tìm thấy tiết mục' });
            res.json({ success: true, data: perf });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy tiết mục', error: error.message });
        }
    }
    static async create(req, res) {
        try {
            const { round_id, title, order_in_round } = req.body;
            if (!round_id || !title)
                return res.status(400).json({ success: false, message: 'Thiếu thông tin required!' });
            const data = await PerformanceModel.create({ round_id, title, order_in_round });
            res.status(201).json({ success: true, message: 'Tạo tiết mục thành công', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi tạo tiết mục', error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { round_id, title, order_in_round } = req.body;
            const exists = await PerformanceModel.exists(id);
            if (!exists)
                return res.status(404).json({ success: false, message: 'Không tìm thấy tiết mục' });
            const data = await PerformanceModel.update(id, { round_id, title, order_in_round });
            res.json({ success: true, message: 'Cập nhật thành công', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tiết mục', error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const exists = await PerformanceModel.exists(id);
            if (!exists)
                return res.status(404).json({ success: false, message: 'Không tìm thấy tiết mục' });
            await PerformanceModel.delete(id);
            res.json({ success: true, message: 'Đã xóa tiết mục' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa tiết mục', error: error.message });
        }
    }
}
module.exports = PerformanceController;
