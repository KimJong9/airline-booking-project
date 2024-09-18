const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(bodyParser.json());
app.use(cors());

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/booking', bookingRoutes);


app.listen(PORT, () => {
    console.log(`Booking service running on port ${PORT}`);
});
