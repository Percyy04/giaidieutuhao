const { connection } = require('../config/db');

class RankingController {
    static async getRankingByRound(req, res) {
        try {
            const { roundId } = req.params;
            const [rows] = await connection.query(`
        SELECT 
          p.id AS performance_id,
          p.title,
          r.name AS round_name,
          ROUND(AVG(sd.point), 2) AS avg_score,
          COUNT(DISTINCT s.judge_id) AS judge_count
        FROM performance p
        JOIN round r ON p.round_id = r.id
        LEFT JOIN score s ON s.performance_id = p.id AND s.status = 'submitted'
        LEFT JOIN score_detail sd ON sd.score_id = s.id
        WHERE p.round_id = ?
        GROUP BY p.id, p.title, r.name
        ORDER BY avg_score DESC
      `, [roundId]);

            res.json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy bảng xếp hạng', error: error.message });
        }
    }
}

module.exports = RankingController;
