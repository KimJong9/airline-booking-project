const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'https://0aysflxlh8.execute-api.ap-northeast-2.amazonaws.com/jaws-stage',  // 프론트엔드가 실행 중인 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// 검색 라우터 연결

app.use('/search', searchRoutes);

// 나라 목록 조회
app.get('/search/countries', async (req, res) => {
    const result = await pool.query('SELECT DISTINCT country_name FROM country_city');
    res.json(result.rows);
});

// 도시 목록 조회
app.get('/search/cities/:country_name', async (req, res) => {
    const { country_name } = req.params;
    const result = await pool.query('SELECT city_name FROM country_city WHERE country_name = $1', [country_name]);
    res.json(result.rows);
});

// 공항 목록 조회
app.get('/search/airports/:country_name/:city_name', async (req, res) => {
    const { country_name, city_name } = req.params;
    const result = await pool.query('SELECT airport_id, airport_name FROM airport WHERE country_name = $1 AND city_name = $2', [country_name, city_name]);
    res.json(result.rows);
});

// 항공편 검색
app.get('/search/flights', async (req, res) => {
    const { departureAirport, departureDate, arrivalDate } = req.query;
    const result = await pool.query(`
        SELECT * FROM flight
        WHERE departure_airport_id = $1
        AND departure_date = $2
        AND arrival_date = $3
    `, [departureAirport, departureDate, arrivalDate]);
    res.json(result.rows);
});



// 서버 실행
app.listen(PORT, () => {
    console.log(`Search service 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
