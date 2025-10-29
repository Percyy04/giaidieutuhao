const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const config = require('./src/config/config');

const PORT = process.env.PORT || config.port || 3000;

// Khởi động server
(async () => {
    try {
        // Test kết nối DB trước
        await testConnection();
        // Start server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
            console.log(`📝 Môi trường: ${config.nodeEnv}`);
        });
    } catch (err) {
        console.error('❌ Không thể khởi động server do lỗi DB.');
        process.exit(1);
    }
})();
