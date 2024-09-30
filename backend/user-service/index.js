const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://www.jawsfly.net', 'https://test.jawsfly.net']; // 허용할 도메인 리스트

// 미들웨어 설정
app.use(bodyParser.json());

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

app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});


// 라우트 연결
const authRoutes = require('./routes/userRoutes');
app.use('/user', authRoutes);  // /api로 시작하는 요청은 authRoutes에서 처리

// 서버 시작
app.listen(PORT, () => {
    console.log(`user 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
