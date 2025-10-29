const { connection } = require('../config/db');

class OrganizationModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM organization ORDER BY id');
        return rows;
    }

    static async getById(id) {
        const [rows] = await connection.query('SELECT * FROM organization WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ code, name }) {
        const [result] = await connection.query('INSERT INTO organization (code, name) VALUES (?, ?)', [code, name]);
        return { id: result.insertId, code, name };
    }

    static async update(id, { code, name }) {
        await connection.query('UPDATE organization SET code = ?, name = ? WHERE id = ?', [code, name, id]);
        return { id, code, name };
    }

    static async delete(id) {
        return connection.query('DELETE FROM organization WHERE id = ?', [id]);
    }

    static async exists(id) {
        const [row] = await connection.query('SELECT COUNT(*) as count FROM organization WHERE id = ?', [id]);
        return row[0].count > 0;
    }
}

module.exports = OrganizationModel;
