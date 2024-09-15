const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });
// PostgreSQL 연결 설정
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true// Aurora 클러스터를 사용하는 경우 SSL 설정이 필요할 수 있음
    }
});

// 연결 테스트
pool.connect((err) => {
    if (err) {
        console.error('PostgreSQL 연결 실패:', err);
        return;
    }
    console.log('PostgreSQL에 성공적으로 연결되었습니다.');
});

module.exports = pool;

