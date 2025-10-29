const { connection } = require('../config/db');
class ScoreModel {
    static async getById(scoreId) {
        const [rows] = await connection.query(
            `SELECT s.id, s.performance_id, s.judge_id, s.status, s.created_at
      FROM score s WHERE s.id = ?`, [scoreId]);
        if (rows.length === 0) return null;
        const score = rows[0];
        const [details] = await connection.query(
            `SELECT sd.id, sd.criterion_id, sd.point, sd.note, c.name as criterion_name, c.max_score, c.order_idx
      FROM score_detail sd JOIN criterion c ON sd.criterion_id = c.id
      WHERE sd.score_id = ? ORDER BY c.order_idx`, [scoreId]);
        score.details = details;
        return score;
    }
    static async createOrGet(performance_id, judge_id) {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            const [existing] = await conn.query(
                'SELECT id FROM score WHERE performance_id = ? AND judge_id = ?', [performance_id, judge_id]);
            if (existing.length > 0) {
                await conn.commit();
                return { id: existing[0].id, created: false };
            }
            const [result] = await conn.query(
                'INSERT INTO score (performance_id, judge_id, status) VALUES (?, ?, ?)', [performance_id, judge_id, 'draft']);
            await conn.commit();
            return { id: result.insertId, created: true };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
    static async updateAllDetails(score_id, detailsArr = []) {
        const sql = "UPDATE score_detail SET point = ?, note = ? WHERE score_id = ? AND criterion_id = ?";
        for (const d of detailsArr) {
            await connection.execute(sql, [d.point, d.note || null, score_id, d.criterion_id]
            );
        }
    }
    static async updateStatus(score_id, status) {
        if (status && ['draft', 'submitted'].includes(status)) {
            await connection.query('UPDATE score SET status = ? WHERE id = ?', [status, score_id]);
        }
    }
}
module.exports = ScoreModel;
