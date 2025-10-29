const { connection } = require('../config/db');

class StatisticsController {
    static async getRoundStatistics(req, res) {
        try {
            const { roundId } = req.params;

            // Tổng số tiết mục
            const [perfCount] = await connection.query(
                'SELECT COUNT(*) as total FROM performance WHERE round_id = ?',
                [roundId]
            );

            // Số tiết mục đã được chấm (có ít nhất 1 judge submitted)
            const [scoredCount] = await connection.query(`
        SELECT COUNT(DISTINCT p.id) as scored
        FROM performance p
        JOIN score s ON s.performance_id = p.id AND s.status = 'submitted'
        WHERE p.round_id = ?
      `, [roundId]);

            // Số giám khảo đã chấm
            const [judgeCount] = await connection.query(`
        SELECT COUNT(DISTINCT s.judge_id) as judges
        FROM score s
        JOIN performance p ON p.id = s.performance_id
        WHERE p.round_id = ? AND s.status = 'submitted'
      `, [roundId]);

            // Điểm cao nhất, thấp nhất, trung bình
            const [scoreStats] = await connection.query(`
        SELECT 
          ROUND(MAX(avg_score), 2) as highest_score,
          ROUND(MIN(avg_score), 2) as lowest_score,
          ROUND(AVG(avg_score), 2) as overall_avg
        FROM (
          SELECT AVG(sd.point) as avg_score
          FROM performance p
          JOIN score s ON s.performance_id = p.id AND s.status = 'submitted'
          JOIN score_detail sd ON sd.score_id = s.id
          WHERE p.round_id = ?
          GROUP BY p.id
        ) AS perf_scores
      `, [roundId]);

            res.json({
                success: true,
                data: {
                    total_performances: perfCount[0].total,
                    scored_performances: scoredCount[0].scored,
                    total_judges: judgeCount[0].judges,
                    highest_score: scoreStats[0].highest_score || 0,
                    lowest_score: scoreStats[0].lowest_score || 0,
                    overall_average: scoreStats[0].overall_avg || 0
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thống kê',
                error: error.message
            });
        }
    }
}

module.exports = StatisticsController;
    