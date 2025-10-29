const CriterionModel = require('../models/criterion.model');

class CriterionController {
    static async getAll(req, res) {
        try {
            const data = await CriterionModel.getAll();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách tiêu chí',
                error: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const criterion = await CriterionModel.getById(id);
            if (!criterion) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy tiêu chí'
                });
            }
            res.json({ success: true, data: criterion });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy tiêu chí',
                error: error.message
            });
        }
    }
}

module.exports = CriterionController;
