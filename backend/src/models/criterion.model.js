const { connection } = require('../config/db');

class CriterionModel {
    static async getAll() {
        const [rows] = await connection.query(
            'SELECT id, name, max_score, order_idx FROM criterion ORDER BY order_idx ASC'
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await connection.query(
            'SELECT id, name, max_score, order_idx FROM criterion WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = CriterionModel;
