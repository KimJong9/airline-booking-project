const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/flightRoutes');
require('dotenv').config();
const pool = require('./config/db');

const allowedOrigins = ['https://www.jawsfly.net', 'https://test.jawsfly.net']; // 허용할 도메인 리스트

const app = express();
const PORT = process.env.PORT || 5001;

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.json());

// 검색 라우터 연결

app.use('/flight', searchRoutes);
app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Search service 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
