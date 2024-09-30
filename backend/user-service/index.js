const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


const originURL = process.env.ORIGIN_URL;

app.use(bodyParser.json());

app.use(cors({
    origin: `${originURL}`,  // 프론트엔드가 실행 중인 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
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
