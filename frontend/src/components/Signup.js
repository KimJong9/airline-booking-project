import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/signup', {
            username,
            password,
            email,
            full_name: fullName, // RDS 테이블 컬럼에 맞춘 이름
            phone_number: phoneNumber // phone_number 추가
        })
            .then(response => {
                console.log('회원가입 성공:', response.data);
            })
            .catch(error => {
                console.error('회원가입 실패:', error);
            });
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>회원가입</h2>
                <div className="form-group">
                    <label>아이디:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>비밀번호:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>이름:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>이메일:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>휴대폰 번호:</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <button type="submit">회원가입</button>
                <div className="form-footer">
                    <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
                </div>
            </form>
        </div>
    );
};


export default Signup;
