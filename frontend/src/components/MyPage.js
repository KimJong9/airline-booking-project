import React, { useState, useEffect } from 'react';
import './MyPage.css';
import axios from 'axios';

function MyPage() {
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        // 백엔드에서 사용자 정보 가져오기
        axios.get('/api/myprofile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('사용자 정보 가져오기 실패', error);
            });
    }, []);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = () => {
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
            .then((response) => {
                setMessage('비밀번호가 성공적으로 변경되었습니다.');
            })
            .catch((error) => {
                setMessage('비밀번호 변경에 실패했습니다.');
            });
    };

    return (
        <div className="mypage-container">
            <h2>My Page</h2>
            <div className="profile-info">
                <p><strong>이름:</strong> {userData.name}</p>
                <p><strong>아이디:</strong> {userData.username}</p>
                <p><strong>이메일:</strong> {userData.email}</p>
            </div>

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
