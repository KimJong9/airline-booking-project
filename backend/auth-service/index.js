const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(cors());

// 라우트 연결
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);  // /api로 시작하는 요청은 authRoutes에서 처리

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
