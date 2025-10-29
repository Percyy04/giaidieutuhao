const ScoreModel = require('../models/score.model');
const { connection } = require('../config/db');
class ScoreController {
    static async createOrGet(req, res) {
        try {
            const { performance_id, judge_id } = req.body;
            if (!performance_id || !judge_id)
                return res.status(400).json({ success: false, message: 'Thiếu performance_id hoặc judge_id!' });
            const result = await ScoreModel.createOrGet(performance_id, judge_id);
            const data = await ScoreModel.getById(result.id);
            res.status(result.created ? 201 : 200).json({ success: true, message: result.created ? 'Tạo mới' : 'Đã có', data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi tạo/get score', error: error.message });
        }
    }
    static async getByPerformanceAndJudge(req, res) {
        try {
            const { performanceId, judgeId } = req.params;
            const [row] = await connection.query('SELECT id FROM score WHERE performance_id = ? AND judge_id = ?',
                [performanceId, judgeId]);
            if (!row.length)
                return res.status(404).json({ success: false, message: 'Chưa có bảng điểm' });
            const score = await ScoreModel.getById(row[0].id);
            res.json({ success: true, data: score });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Lỗi', error: e.message });
        }
    }
    static async updateScore(req, res) {
        try {
            const { scoreId } = req.params; // ← ĐẢM BẢO LẤY ĐÚNG PARAMS
            const { details, status } = req.body;

            console.log('scoreId:', scoreId, 'details:', details); // Debug log

            if (!details || !Array.isArray(details) || details.length !== 4)
                return res.status(400).json({ success: false, message: 'Thiếu hoặc sai chi tiết điểm' });

            await ScoreModel.updateAllDetails(scoreId, details);
            await ScoreModel.updateStatus(scoreId, status);
            res.json({ success: true, message: 'Lưu điểm thành công!' });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật điểm', error: e.message });
        }
    }

}
module.exports = ScoreController;
