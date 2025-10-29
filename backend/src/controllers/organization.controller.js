const OrganizationModel = require('../models/organization.model');

class OrganizationController {
    static async getAll(req, res) {
        try {
            const data = await OrganizationModel.getAll();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const org = await OrganizationModel.getById(id);
            if (!org) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
            res.json({ success: true, data: org });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { code, name } = req.body;
            if (!code || !name) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
            const data = await OrganizationModel.create({ code, name });
            res.status(201).json({ success: true, message: 'Tạo thành công', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { code, name } = req.body;
            const exists = await OrganizationModel.exists(id);
            if (!exists) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
            const data = await OrganizationModel.update(id, { code, name });
            res.json({ success: true, message: 'Cập nhật thành công', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const exists = await OrganizationModel.exists(id);
            if (!exists) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
            await OrganizationModel.delete(id);
            res.json({ success: true, message: 'Đã xóa' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi', error: error.message });
        }
    }
}

module.exports = OrganizationController;
