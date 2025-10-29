const { connection } = require('../config/db');

class TeamModel {
    // Lấy tất cả đội
    static async getAll() {
        const [rows] = await connection.query(`
      SELECT * FROM team 
      ORDER BY name ASC
    `);
        return rows;
    }

    // Lấy đội theo ID
    static async getById(id) {
        const [rows] = await connection.query(
            'SELECT * FROM team WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Tạo đội mới
    static async create(data) {
        const { name } = data;
        const [result] = await connection.query(
            'INSERT INTO team (name) VALUES (?)',
            [name]
        );
        return {
            id: result.insertId,
            name
        };
    }

    // Tạo nhiều đội cùng lúc (bulk insert)
    static async createBulk(teams) {
        if (!teams || teams.length === 0) return [];

        const values = teams.map(team => [team.name]);
        const [result] = await connection.query(
            'INSERT INTO team (name) VALUES ?',
            [values]
        );

        // Trả về danh sách teams đã tạo
        return teams.map((team, index) => ({
            id: result.insertId + index,
            name: team.name
        }));
    }

    // Cập nhật đội
    static async update(id, data) {
        const { name } = data;
        await connection.query(
            'UPDATE team SET name = ? WHERE id = ?',
            [name, id]
        );
        return this.getById(id);
    }

    // Xóa đội
    static async delete(id) {
        const [result] = await connection.query(
            'DELETE FROM team WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Kiểm tra đội có tồn tại không
    static async exists(id) {
        const [rows] = await connection.query(
            'SELECT COUNT(*) as count FROM team WHERE id = ?',
            [id]
        );
        return rows[0].count > 0;
    }
}

module.exports = TeamModel;
