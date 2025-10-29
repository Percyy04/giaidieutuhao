const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('✅ Loaded ENV variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15, // phút
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

    db: {
        host: (process.env.DB_HOST || 'localhost').trim(),
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USERNAME || process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'giai_dieu_tu_hao_v2',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
};
