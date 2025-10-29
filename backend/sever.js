const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const config = require('./src/config/config');

const PORT = config.port;

// Khởi động server
(async () => {
    try {
        // Test kết nối DB trước
        await testConnection();
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
            console.log(`📝 Môi trường: ${config.nodeEnv}`);
        });
    } catch (err) {
        console.error('❌ Không thể khởi động server do lỗi DB.');
        process.exit(1);
    }
})();
