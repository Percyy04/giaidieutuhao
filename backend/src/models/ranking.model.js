const { connection } = require('../config/db');

class RankingModel {
    // Lấy bảng xếp hạng theo vòng thi
    static async getRankingByRound(roundId) {
        const [rows] = await connection.query(`
      SELECT 
        p.id as performance_id,
        p.name as performance_name,
        p.order_in_round,
        t.id as team_id,
        t.name as team_name,
        r.id as round_id,
        r.name as round_name,
        ROUND(AVG(sd.point), 2) as avg_score,
        COUNT(DISTINCT s.judge_id) as judge_count
      FROM performance p
      JOIN team t ON p.team_id = t.id
      JOIN round r ON p.round_id = r.id
      LEFT JOIN score s ON s.performance_id = p.id
      LEFT JOIN score_detail sd ON sd.score_id = s.id
      WHERE p.round_id = ?
      GROUP BY p.id, p.name, p.order_in_round, t.id, t.name, r.id, r.name
      ORDER BY avg_score DESC, p.order_in_round
    `, [roundId]);

        // Thêm rank
        return rows.map((row, index) => ({
            ...row,
            rank: index + 1
        }));
    }

    // Lấy bảng xếp hạng toàn cuộc thi
    static async getRankingAll() {
        const [rows] = await connection.query(`
      SELECT 
        p.id as performance_id,
        p.name as performance_name,
        t.id as team_id,
        t.name as team_name,
        r.id as round_id,
        r.name as round_name,
        ROUND(AVG(sd.point), 2) as avg_score,
        COUNT(DISTINCT s.judge_id) as judge_count
      FROM performance p
      JOIN team t ON p.team_id = t.id
      JOIN round r ON p.round_id = r.id
      LEFT JOIN score s ON s.performance_id = p.id
      LEFT JOIN score_detail sd ON sd.score_id = s.id
      GROUP BY p.id, p.name, t.id, t.name, r.id, r.name
      ORDER BY r.id, avg_score DESC
    `);

        return rows;
    }

    // Lấy top N
    static async getTopN(roundId, limit = 10) {
        const ranking = await this.getRankingByRound(roundId);
        return ranking.slice(0, limit);
    }
}

module.exports = RankingModel;
