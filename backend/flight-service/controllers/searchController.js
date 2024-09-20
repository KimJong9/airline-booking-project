const pool = require('../config/db');

// 사용자 정보 검색

exports.getFlightsInfo = async (req, res) => {
    const { departureAirport, departureDate, arrivalAirport, arrivalDate } = req.query;

    try {
        // 1. 출발 공항에서 도착 공항으로 가는 비행편 조회
        const outboundFlights = await pool.query(
            "SELECT * FROM flight WHERE departure_airport_id = $1 AND destination_airport_id = $2 AND departure_date = $3",
            [departureAirport, arrivalAirport, departureDate]
        );

        // 2. 도착 공항에서 출발 공항으로 돌아오는 비행편 조회
        const returnFlights = await pool.query(
            "SELECT * FROM flight WHERE departure_airport_id = $1 AND destination_airport_id = $2 AND departure_date = $3",
            [arrivalAirport, departureAirport, arrivalDate]
        );
        console.log('Outbound Flights:', outboundFlights.rows);
        console.log('Return Flights:', returnFlights.rows);
        // 3. 두 비행편을 모두 포함하여 응답
        return res.json({
            outboundFlights: outboundFlights.rows,
            returnFlights: returnFlights.rows
        });
    } catch (error) {
        console.error("비행편 조회 중 에러 발생:", error);
        res.status(500).json({ error: "비행편을 찾는 중 문제가 발생했습니다." });
    }
};