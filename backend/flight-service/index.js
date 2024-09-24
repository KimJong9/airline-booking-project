const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/flightRoutes');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'https://api.jawsfly.net',  // 프론트엔드가 실행 중인 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// 검색 라우터 연결

app.use('/flight', searchRoutes);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Search service 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
