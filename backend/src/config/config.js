const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('✅ Loaded ENV variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST|| 'project-db.cx06mg4wyw2q.ap-southeast-2.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'adminswd392***',
    database: process.env.DB_NAME || 'giai_dieu_tu_hao_v2',
    port: process.env.DB_PORT || 3306,
  }
};
