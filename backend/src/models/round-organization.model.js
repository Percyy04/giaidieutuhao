const { connection } = require('../config/db');

class RoundOrganizationModel {
    // Phân công đơn vị vào vòng thi
    static async assign(roundId, orgId) {
        try {
            const [result] = await connection.query(
                'INSERT INTO round_organization (round_id, org_id) VALUES (?, ?)',
                [roundId, orgId]
            );
            return {
                id: result.insertId,
                round_id: roundId,
                org_id: orgId
            };
        } catch (error) {
            // Bỏ qua lỗi duplicate (đã phân công rồi)
            if (error.code === 'ER_DUP_ENTRY') {
                return null;
            }
            throw error;
        }
    }

    // Phân công nhiều đơn vị vào một vòng
    static async assignMultiple(roundId, orgIds) {
        const assignments = [];
        for (const orgId of orgIds) {
            const result = await this.assign(roundId, orgId);
            if (result) assignments.push(result);
        }
        return assignments;
    }

    // Hủy phân công đơn vị khỏi vòng thi
    static async unassign(roundId, orgId) {
        const [result] = await connection.query(
            'DELETE FROM round_organization WHERE round_id = ? AND org_id = ?',
            [roundId, orgId]
        );
        return result.affectedRows > 0;
    }

    // Lấy tất cả đơn vị được phân công cho một vòng
    static async getOrganizationsByRound(roundId) {
        const [rows] = await connection.query(`
      SELECT 
        o.id,
        o.code,
        o.name,
        o.created_at
      FROM round_organization ro
      JOIN organization o ON ro.org_id = o.id
      WHERE ro.round_id = ?
      ORDER BY o.name ASC
    `, [roundId]);
        return rows;
    }

    // Kiểm tra đơn vị có được phân công vào vòng không
    static async isAssigned(roundId, orgId) {
        const [rows] = await connection.query(
            'SELECT COUNT(*) as count FROM round_organization WHERE round_id = ? AND org_id = ?',
            [roundId, orgId]
        );
        return rows[0].count > 0;
    }

    // Xóa tất cả phân công của một vòng
    static async clearRoundAssignments(roundId) {
        const [result] = await connection.query(
            'DELETE FROM round_organization WHERE round_id = ?',
            [roundId]
        );
        return result.affectedRows;
    }
}

module.exports = RoundOrganizationModel;
