const { connection } = require('../config/db');

class JudgeModel {
    // Login - kiểm tra email + org_id
    static async login(email, org_id) {
        const [rows] = await connection.query(
            `SELECT j.id, j.org_id, j.full_name, j.email, o.name as org_name, o.code as org_code
       FROM judge j
       JOIN organization o ON j.org_id = o.id
       WHERE j.email = ? AND j.org_id = ?`,
            [email, org_id]
        );
        return rows[0];
    }

    // Lấy danh sách tiết mục judge cần chấm (theo vòng được phân công)
    static async getPerformancesToScore(judgeId) {
        const [rows] = await connection.query(
            `SELECT 
        p.id, p.title, p.order_in_round, r.id as round_id, r.name as round_name,
        CASE 
          WHEN s.id IS NULL THEN 'not_started'
          WHEN s.status = 'draft' THEN 'draft'
          WHEN s.status = 'submitted' THEN 'submitted'
        END as scoring_status,
        s.id as score_id
      FROM performance p
      JOIN round r ON p.round_id = r.id
      JOIN round_organization ro ON ro.round_id = r.id
      JOIN judge j ON j.org_id = ro.org_id
      LEFT JOIN score s ON s.performance_id = p.id AND s.judge_id = j.id
      WHERE j.id = ?
      ORDER BY r.id, p.order_in_round`,
            [judgeId]
        );
        return rows;
    }

    // CRUD Judge
    static async getAll() {
        const [rows] = await connection.query(
            `SELECT j.id, j.org_id, j.full_name, j.email, o.name as org_name
       FROM judge j JOIN organization o ON j.org_id = o.id
       ORDER BY j.id DESC`
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await connection.query(
            `SELECT j.id, j.org_id, j.full_name, j.email, o.name as org_name
       FROM judge j JOIN organization o ON j.org_id = o.id
       WHERE j.id = ?`, [id]
        );
        return rows[0];
    }

    static async create({ org_id, full_name, email }) {
        const [result] = await connection.query(
            'INSERT INTO judge (org_id, full_name, email) VALUES (?, ?, ?)',
            [org_id, full_name, email]
        );
        return { id: result.insertId, org_id, full_name, email };
    }

    static async update(id, { org_id, full_name, email }) {
        await connection.query(
            'UPDATE judge SET org_id = ?, full_name = ?, email = ? WHERE id = ?',
            [org_id, full_name, email, id]
        );
        return { id, org_id, full_name, email };
    }

    static async delete(id) {
        return connection.query('DELETE FROM judge WHERE id = ?', [id]);
    }

    static async exists(id) {
        const [row] = await connection.query('SELECT COUNT(*) as count FROM judge WHERE id = ?', [id]);
        return row[0].count > 0;
    }
}

module.exports = JudgeModel;
