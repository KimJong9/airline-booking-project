const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = ['https://www.jawsfly.net', 'https://test.jawsfly.net']; // 허용할 도메인 리스트

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

const bookingRoutes = require('./routes/bookingRoutes');

app.use('/booking', bookingRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});


app.listen(PORT, () => {
    console.log(` Booking service running on port ${PORT}`);
});
