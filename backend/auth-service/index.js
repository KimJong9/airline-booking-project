const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors());

// DB 연결 설정 (선택: config/db.js에서 가져올 수도 있음)
const db = mysql.createConnection({
    host: 'your-rds-endpoint',
    user: 'your-username',
    password: 'your-password',
    database: 'airline_booking'
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
        return;
    }
    console.log('DB에 성공적으로 연결되었습니다.');
});

// 라우트 연결
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);  // /api로 시작하는 요청은 authRoutes에서 처리

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
