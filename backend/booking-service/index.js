const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(bodyParser.json());
app.use(cors({
    origin: ['https://api.jawsfly.net', "https://www.jawsfly.net"],  // 프론트엔드가 실행 중인 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/booking', bookingRoutes);


app.listen(PORT, () => {
    console.log(` A~~~ Booking service running on port ${PORT}`);
});
