import './List.css'
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const List = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flights } = location.state || {};

    // 안전하게 outboundFlights와 returnFlights를 구조분해 할당
    const outboundFlights = flights?.outboundFlights || [];
    const returnFlights = flights?.returnFlights || [];

    const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
    const [selectedArrivalFlight, setSelectedArrivalFlight] = useState(null);

    const handleSelectDeparture = (flight) => {
        setSelectedDepartureFlight(flight);
    };

    const handleSelectArrival = (flight) => {
        setSelectedArrivalFlight(flight);
    };

    const handlePayment = () => {
        if (selectedDepartureFlight && selectedArrivalFlight) {
            navigate('/payment', {
                state: {
                    departureFlight: selectedDepartureFlight,
                    arrivalFlight: selectedArrivalFlight
                }
            });
        }
    };

    console.log('Outbound Flights:', outboundFlights); // 디버깅용 로그
    console.log('Return Flights:', returnFlights);   // 디버깅용 로그

    return (
        <div>
            <h2>가는 비행편</h2>
            {outboundFlights.length > 0 ? (
                <ul>
                    {outboundFlights.map((flight, index) => (
                        <li key={index}>
                            {flight.flight_code} | {flight.departure_airport_id} -> {flight.destination_airport_id} | 출발 시간: {flight.departure_time}
                            <button onClick={() => handleSelectDeparture(flight)}>선택</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>가는 비행편이 없습니다.</p>
            )}

            <h2>오는 비행편</h2>
            {returnFlights.length > 0 ? (
                <ul>
                    {returnFlights.map((flight, index) => (
                        <li key={index}>
                            {flight.flight_code} | {flight.departure_airport_id} -> {flight.destination_airport_id} | 출발 시간: {flight.departure_time}
                            <button onClick={() => handleSelectArrival(flight)}>선택</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>오는 비행편이 없습니다.</p>
            )}

            {/* 선택된 출발지와 도착지 표시 */}
            <div>
                <div>
                    <h3>선택한 출발지</h3>
                    {selectedDepartureFlight ? (
                        <p>{selectedDepartureFlight.flight_code} | {selectedDepartureFlight.departure_airport_id} -> {selectedDepartureFlight.destination_airport_id} | 출발 시간: {selectedDepartureFlight.departure_time}</p>
                    ) : (
                        <p>출발지를 선택하세요</p>
                    )}
                </div>

                <div>
                    <h3>선택한 도착지</h3>
                    {selectedArrivalFlight ? (
                        <p>{selectedArrivalFlight.flight_code} | {selectedArrivalFlight.departure_airport_id} -> {selectedArrivalFlight.destination_airport_id} | 출발 시간: {selectedArrivalFlight.departure_time}</p>
                    ) : (
                        <p>도착지를 선택하세요</p>
                    )}
                </div>
            </div>

            {/* 결제 버튼 (출발지와 도착지 모두 선택해야만 표시) */}
            {selectedDepartureFlight && selectedArrivalFlight && (
                <button onClick={handlePayment}>결제</button>
            )}
        </div>
    );
};

export default List;
