import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const { departureFlight, arrivalFlight } = location.state || {};

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

            {/* 결제 관련 정보 처리 */}
        </div>
    );
};

export default Payment;
