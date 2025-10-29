const { connection } = require('../config/db');
class PerformanceModel {
    static async getAll({ round_id }) {
        let sql = `SELECT p.id, p.round_id, p.title, p.order_in_round, r.name AS round_name
      FROM performance p JOIN round r ON p.round_id = r.id WHERE 1=1`;
        const params = [];
        if (round_id) {
            sql += ' AND p.round_id = ?';
            params.push(round_id);
        }
        sql += ' ORDER BY p.order_in_round ASC, p.id ASC';
        const [rows] = await connection.query(sql, params);
        return rows;
    }
    static async getById(id) {
        const [rows] = await connection.query(
            `SELECT p.id, p.round_id, p.title, p.order_in_round, r.name AS round_name
       FROM performance p JOIN round r ON p.round_id = r.id WHERE p.id = ?`, [id]);
        return rows[0];
    }
    static async create({ round_id, title, order_in_round }) {
        const [res] = await connection.query(
            'INSERT INTO performance (round_id, title, order_in_round) VALUES (?, ?, ?)',
            [round_id, title, order_in_round]
        );
        return { id: res.insertId, round_id, title, order_in_round };
    }
    static async update(id, { round_id, title, order_in_round }) {
        await connection.query(
            'UPDATE performance SET round_id = ?, title = ?, order_in_round = ? WHERE id = ?',
            [round_id, title, order_in_round, id]
        );
        return { id, round_id, title, order_in_round };
    }
    static async delete(id) {
        return connection.query('DELETE FROM performance WHERE id = ?', [id]);
    }
    static async exists(id) {
        const [row] = await connection.query('SELECT COUNT(*) as count FROM performance WHERE id = ?', [id]);
        return row[0].count > 0;
    }
}
module.exports = PerformanceModel;
