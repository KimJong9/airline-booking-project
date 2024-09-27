import './List.css';
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const List = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flights } = location.state || {};

    const outboundFlights = flights?.outboundFlights || [];
    const returnFlights = flights?.returnFlights || [];

    const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
    const [selectedArrivalFlight, setSelectedArrivalFlight] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [showPopup, setShowPopup] = useState(false);   // 팝업 상태 관리

    // 로그인 상태 확인 (토큰 확인)
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('토큰이 없습니다.');
                setIsLoggedIn(false);
                return;
            }

            try {
                // 토큰이 있으면 JWT 토큰 확인
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const username = decodedToken.username;
                console.log('로그인된 사용자:', username);
                setIsLoggedIn(true); // 로그인 상태 설정
            } catch (error) {
                console.error('토큰 확인 실패:', error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleSelectDeparture = (flight) => {
        setSelectedDepartureFlight(flight);
    };

    const handleSelectArrival = (flight) => {
        setSelectedArrivalFlight(flight);
    };

    const handlePayment = () => {
        if (!isLoggedIn) {
            // 로그인이 안되어 있으면 팝업 표시
            setShowPopup(true);
        } else if (selectedDepartureFlight && selectedArrivalFlight) {
            // 로그인이 되어 있으면 결제 페이지로 이동
            navigate('/payment', {
                state: {
                    departureFlight: selectedDepartureFlight,
                    arrivalFlight: selectedArrivalFlight
                }
            });
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <h2>가는 비행편</h2>
            {outboundFlights.length > 0 ? (
                <ul>
                    {outboundFlights.map((flight, index) => (
                        <li key={index}>
                            {flight.flight_code} | {flight.departure_airport} -> {flight.destination_airport} | 출발 시간: {flight.departure_time}
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
                            {flight.flight_code} | {flight.departure_airport} -> {flight.destination_airport} | 출발 시간: {flight.departure_time}
                            <button onClick={() => handleSelectArrival(flight)}>선택</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>오는 비행편이 없습니다.</p>
            )}

            <div>
                <div>
                    <h3>선택한 출발지</h3>
                    {selectedDepartureFlight ? (
                        <p>{selectedDepartureFlight.flight_code} | {selectedDepartureFlight.departure_airport} -> {selectedDepartureFlight.destination_airport} | 출발 시간: {selectedDepartureFlight.departure_time}</p>
                    ) : (
                        <p>출발지를 선택하세요</p>
                    )}
                </div>

                <div>
                    <h3>선택한 도착지</h3>
                    {selectedArrivalFlight ? (
                        <p>{selectedArrivalFlight.flight_code} | {selectedArrivalFlight.departure_airport} -> {selectedArrivalFlight.destination_airport} | 출발 시간: {selectedArrivalFlight.departure_time}</p>
                    ) : (
                        <p>도착지를 선택하세요</p>
                    )}
                </div>
            </div>

            {selectedDepartureFlight && selectedArrivalFlight && (
                <button onClick={handlePayment}>결제</button>
            )}

            {/* 팝업 표시 */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>로그인 후 결제가 가능합니다. 로그인 페이지로 이동하시겠습니까?</p>
                        <button onClick={() => navigate('/login')}>로그인</button>
                        <button onClick={closePopup}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;
