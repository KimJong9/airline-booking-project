import React from 'react';
import { useLocation } from 'react-router-dom';

const List = () => {
    const location = useLocation();
    const flights = location.state?.flights || [];  // 전달된 항공편 데이터

    return (
        <div>
            <h2>항공편 목록</h2>
            {flights.length > 0 ? (
                <ul>
                    {flights.map((flight) => (
                        <li key={flight.flight_code}>
                            {flight.flight_code} - 출발: {flight.departure_date} {flight.departure_time} / 도착: {flight.arrival_date} {flight.arrival_time}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>검색된 항공편이 없습니다.</p>
            )}
        </div>
    );
};

export default List;
