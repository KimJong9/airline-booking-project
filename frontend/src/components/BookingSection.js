import React, { useState } from 'react';
import './BookingSection.css';

function BookingSection() {
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');

    const handleBooking = () => {
        // 예매 처리 로직 (추후 API 연동)
        console.log(`Booking flight from ${departure} to ${arrival}`);
        console.log(`Departure on ${departureDate}, Arrival on ${arrivalDate}`);
    };

    return (
        <div className="booking-section">
            <h2>항공권 예매</h2>
            <div className="form">
                <label>출발지:</label>
                <input
                    type="text"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                />

                <label>도착지:</label>
                <input
                    type="text"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                />

                <label>출발 날짜:</label>
                <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                />

                <label>도착 날짜:</label>
                <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                />

                <button onClick={handleBooking}>항공권 검색</button>
            </div>
        </div>
    );
}

export default BookingSection;
