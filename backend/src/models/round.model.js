const { connection } = require('../config/db');

class RoundModel {
    // Lấy tất cả vòng thi
    static async getAll() {
        const [rows] = await connection.query(`
      SELECT * FROM round 
      ORDER BY created_at DESC
    `);
        return rows;
    }

    // Lấy vòng thi theo ID (kèm danh sách đơn vị được phân công)
    static async getById(id) {
        const [rounds] = await connection.query(
            'SELECT * FROM round WHERE id = ?',
            [id]
        );

        if (rounds.length === 0) return null;

        const round = rounds[0];

        // Lấy danh sách đơn vị được phân công cho vòng này
        const [organizations] = await connection.query(`
      SELECT 
        o.id, 
        o.code, 
        o.name
      FROM round_organization ro
      JOIN organization o ON ro.org_id = o.id
      WHERE ro.round_id = ?
    `, [id]);

        round.organizations = organizations;
        return round;
    }

    // Tạo vòng thi mới
    static async create(data) {
        const { name } = data;
        const [result] = await connection.query(
            'INSERT INTO round (name) VALUES (?)',
            [name]
        );
        return this.getById(result.insertId);
    }

    // Cập nhật vòng thi
    static async update(id, data) {
        const { name } = data;
        await connection.query(
            'UPDATE round SET name = ? WHERE id = ?',
            [name, id]
        );
        return this.getById(id);
    }

    // Xóa vòng thi
    static async delete(id) {
        const [result] = await connection.query(
            'DELETE FROM round WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Kiểm tra vòng thi có tồn tại không
    static async exists(id) {
        const [rows] = await connection.query(
            'SELECT COUNT(*) as count FROM round WHERE id = ?',
            [id]
        );
        return rows[0].count > 0;
    }

    // Lấy vòng thi mà một đơn vị được phân công chấm
    static async getRoundsByOrganization(orgId) {
        const [rows] = await connection.query(`
      SELECT 
        r.id,
        r.name,
        r.created_at
      FROM round r
      JOIN round_organization ro ON ro.round_id = r.id
      WHERE ro.org_id = ?
      ORDER BY r.created_at DESC
    `, [orgId]);
        return rows;
    }
}

module.exports = RoundModel;
