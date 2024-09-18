const pool = require('../config/db');

// Function to create a booking
exports.booking = async (req, res) => {
    console.log(req.body);
    const { userId, departureFlight, arrivalFlight } = req.body;
    try {
        // Insert booking into the 'booking' table
        const response = await pool.query(
            `INSERT INTO booking (username, flight_code) VALUES ($1, $2), ($1, $3)`,
            [userId, departureFlight, arrivalFlight]
        );
        return res.status(201).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error booking flight:', error);
        res.status(500).json({ message: 'Booking failed222.' });
    }
};
