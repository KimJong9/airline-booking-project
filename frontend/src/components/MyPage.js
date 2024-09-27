import React, { useState, useEffect } from 'react';
import './MyPage.css';
import axios from 'axios';

const MyPage = () => {
    const [userData, setUserData] = useState({});
    const [bookings, setBookings] = useState([]); // 사용자 예약 데이터를 저장할 상태
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('토큰이 없습니다.');
                return;
            }

            try {
                // JWT 토큰에서 아이디 추출
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const username = decodedToken.username; // 토큰에 담긴 사용자 아이디

                // 사용자 정보를 DB에서 가져오기
                const response = await axios.get(`https://alb.heroic.today/user/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data); // 가져온 데이터 저장

                // 예약 정보 가져오기
                const bookingResponse = await axios.get(`https://alb.heroic.today/user/${username}/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(bookingResponse.data); // 예약 데이터 저장
            } catch (error) {
                console.error('사용자 정보 및 예약 정보 가져오기 실패:', error);
            }
        };

        fetchUserData();
    }, []);

    // 비밀번호 입력값 업데이트
    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    // 비밀번호 유효성 검사 및 제출
    const handlePasswordSubmit = () => {
        if (passwords.newPassword.length < 8) {
            setMessage('비밀번호는 8자리 이상이어야 합니다.');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        // 비밀번호 변경 요청
        axios.post('/api/update-password', {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                setMessage('비밀번호가 성공적으로 변경되었습니다.');
            })
            .catch(() => {
                setMessage('비밀번호 변경에 실패했습니다.');
            });
    };

    return (
        <div className="mypage-container">
            <h2>My Page</h2>

            {/* 사용자 정보 표시 */}
            <div className="profile-info">
                <p><strong>이름:</strong> {userData.full_name}</p>
                <p><strong>아이디:</strong> {userData.username}</p>
                <p><strong>이메일:</strong> {userData.email}</p>
                <p><strong>전화번호:</strong> {userData.phone_number}</p>
            </div>

            {/* 예약 정보 표시 */}
            <div className="booking-info">
                <h3>내 예약 정보</h3>
                {bookings.length > 0 ? (
                    <ul>
                        {bookings.map((booking, index) => (
                            <li key={index}>
                                <p>항공편: {booking.flight_code}</p>
                                <p>출발지: {booking.departure_airport}</p>
                                <p>도착지: {booking.arrival_airport}</p>
                                <p>출발 시간: {booking.departure_time}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>예약된 항공편이 없습니다.</p>
                )}
            </div>

            {/* 비밀번호 변경 */}
            <div className="password-change">
                <h3>비밀번호 변경</h3>
                <input
                    type="password"
                    name="currentPassword"
                    placeholder="현재 비밀번호"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="새로운 비밀번호"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                />
                <button onClick={handlePasswordSubmit}>비밀번호 변경</button>
                {message && <p className="message">{message}</p>}
            </div>

            <div className="mypage-logo">
                <img src={require('../assets/logo.png')} alt="logo" />
            </div>
        </div>
    );
}

export default MyPage;
