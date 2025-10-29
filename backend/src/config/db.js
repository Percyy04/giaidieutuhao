// src/config/db.js (sửa)
const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config.db);

async function testConnection() {
    try {
        console.log('🔄 Đang thử kết nối tới MySQL...');
        const [rows] = await pool.query('SELECT NOW() AS currentTime');
        console.log('✅ Kết nối DB thành công! Thời gian:', rows[0].currentTime);
        return true;
    } catch (err) {
        console.error('❌ Lỗi khi kết nối DB (full error):', err);
        // in stack để biết nguyên nhân chi tiết
        console.error(err.stack);
        throw err;
    }
}
testConnection();

module.exports = { connection: pool, testConnection };
