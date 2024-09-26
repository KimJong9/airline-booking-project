const pool = require('../config/db');
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqsClient = new SQSClient({ region: "ap-northeast-2" });  // AWS 리전 설정 (필요에 따라 리전 수정)

// Function to create a booking
exports.booking = async (req, res) => {
    console.log(req.body);
    const { userId, departureFlight, arrivalFlight, customer_email } = req.body;
    try {
        // Insert booking into the 'booking' table
        const response = await pool.query(
            `INSERT INTO booking (username, flight_code) VALUES ($1, $2), ($1, $3) RETURNING booking_id`,
            [userId, departureFlight, arrivalFlight]
        );
        const bookingIDs = response.rows.map(row => row.booking_id);
        console.log(bookingIDs);
        // 각 booking_id에 대해 SQS로 메시지를 전송
        for (const bookingID of bookingIDs) {
            console.log(bookingID);
            await sqs(bookingID, customer_email);
        }

        return res.status(201).json({ message: 'Booking successful!'});
    } catch (error) {
        console.error('Error booking flight:', error);
        res.status(500).json({ message: 'Booking failed222.' });
    }
};

const sqs = async (bookingId, customer_email) => {
    const bookingDate = new Date().toISOString(); // booking_date는 현재 시간으로 설정

    try {
        // booking_id로 데이터베이스에서 예약 정보 조회
        const result = await pool.query(
            `SELECT flight_code, username FROM booking WHERE booking_id = $1`,
            [bookingId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const bookingData = result.rows[0]; // 조회된 예약 정보

        // 메시지 내용 구성
        const messageBody = {
            customer_email: customer_email,
            customer_name: bookingData.username,
            flight_code: bookingData.flight_code,
            booking_id: bookingId,
            booking_date: bookingDate
        };

        // SQS로 메시지 전송
        await sendMessageToSQS(messageBody);

        return res.status(200).json({ message: "Message sent successfully to SQS" });
    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({ message: 'Failed to process booking' });
    }
}

// SQS에 메시지 전송하는 함수
async function sendMessageToSQS(messageBody) {
    const params = {
        QueueUrl: "https://sqs.ap-northeast-2.amazonaws.com/241533155281/jaws-mail-order-sqs-jobs", // SQS URL을 정확히 입력
        MessageBody: JSON.stringify(messageBody),  // 메시지 내용 JSON 형식으로 직렬화
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Message sent successfully:", data.MessageId);
    } catch (err) {
        console.error("Error sending message:", err);
    }
}
