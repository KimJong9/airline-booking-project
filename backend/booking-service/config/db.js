
const { Pool } = require('pg');

const dbHost = process.env.DB_HOST;
console.log(process.env.DB_HOST);
// PostgreSQL 연결 설정
const pool = new Pool({
    host: `${dbHost}`,
    user: 'postgres',
    password: 'qwer1234',
    database: 'booking',
    port: 5432,
    ssl: {
        rejectUnauthorized: false// Aurora 클러스터를 사용하는 경우 SSL 설정이 필요할 수 있음
    }
});

pool.connect((err) => {
    if (err) {
        console.error('PostgreSQL 연결 실패:', err);
        return;
    }
    console.log('booking Service가 PostgreSQL에 성공적으로 연결되었습니다.');
});

module.exports = pool;