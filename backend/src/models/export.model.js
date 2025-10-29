const { connection } = require('../config/db');

class ExportModel {
    static async getRankingDataForExport(roundId) {
        const [rows] = await connection.query(`
      SELECT 
        p.id AS performance_id,
        p.title AS performance_name,
        p.order_in_round,
        r.name AS round_name,
        ROUND(AVG(sd.point), 2) AS avg_score,
        COUNT(DISTINCT s.judge_id) AS judge_count,
        GROUP_CONCAT(DISTINCT j.full_name ORDER BY j.id SEPARATOR ', ') AS judges
      FROM performance p
      JOIN round r ON p.round_id = r.id
      LEFT JOIN score s ON s.performance_id = p.id AND s.status = 'submitted'
      LEFT JOIN score_detail sd ON sd.score_id = s.id
      LEFT JOIN judge j ON j.id = s.judge_id
      WHERE p.round_id = ?
      GROUP BY p.id, p.title, p.order_in_round, r.name
      ORDER BY avg_score DESC, p.order_in_round ASC
    `, [roundId]);
        return rows;
    }
}

module.exports = ExportModel;
