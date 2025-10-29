const { connection } = require('../config/db');

class RoundOrganizationModel {
    static async assign(round_id, org_id) {
        const [result] = await connection.query(
            'INSERT IGNORE INTO round_organization (round_id, org_id) VALUES (?, ?)',
            [round_id, org_id]
        );
        return result.affectedRows > 0;
    }

    static async remove(round_id, org_id) {
        const [result] = await connection.query(
            'DELETE FROM round_organization WHERE round_id = ? AND org_id = ?',
            [round_id, org_id]
        );
        return result.affectedRows > 0;
    }

    static async getByRound(round_id) {
        const [rows] = await connection.query(`
      SELECT ro.id, ro.round_id, ro.org_id, o.code, o.name as org_name
      FROM round_organization ro
      JOIN organization o ON o.id = ro.org_id
      WHERE ro.round_id = ?
    `, [round_id]);
        return rows;
    }
}

module.exports = RoundOrganizationModel;
