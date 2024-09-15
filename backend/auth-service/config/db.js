const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
// PostgreSQL 연결 설정
const pool = new Pool({
    host: 'db-airline-test.cluster-c7suesgke65p.ap-northeast-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'qwer1234',
    database: 'airline_booking',
    port: 5432,
    ssl: {
        rejectUnauthorized: false// Aurora 클러스터를 사용하는 경우 SSL 설정이 필요할 수 있음
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

