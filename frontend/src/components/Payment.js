import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // For sending the request


const Payment = () => {
    const location = useLocation();
    const { departureFlight, arrivalFlight} = location.state || {};
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const username = decodedToken.username;

    const [email, setEmail] = useState(''); // 이메일 정보를 저장할 state
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 백엔드의 getUserInfo API 호출
                const response = await axios.get(`https://alb.heroic.today/user/${username}`);
                const userInfo = response.data;

                // 이메일 정보를 state에 저장
                setEmail(userInfo.email);
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
            }
        };
        fetchUserInfo();
    }, [username]);
    const handleBooking = async () => {
        try {
            await axios.post('https://alb.heroic.today/booking', {
                userId: username,
                departureFlight: departureFlight.flight_code,
                arrivalFlight: arrivalFlight.flight_code,
                customer_email: email
            },{withCredentials: true });
            alert('Booking successful!');
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        }
    };
    return (
        <div>
            <h2>결제 정보</h2>
            <div>
                <h3>가는 비행편</h3>
                {departureFlight && (
                    <p>{departureFlight.flight_code} | 출발 시간: {departureFlight.departure_time}</p>
                )}
            </div>

            <div>
                <h3>오는 비행편</h3>
                {arrivalFlight && (
                    <p>{arrivalFlight.flight_code} | 출발 시간: {arrivalFlight.departure_time}</p>
                )}
            </div>

            {/* Confirm Booking Button */}
            <button onClick={handleBooking}>예약 하기</button>
        </div>
    );
};

export default Payment;
