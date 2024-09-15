import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(setIsLoggedIn, IsLoggedIn=false) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // useNavigate 훅 사용

    const handleLogin = () => {
        axios.post('http://localhost:5000/api/login', { username, password })
            .then((response) => {
                localStorage.setItem('token', response.data.token);  // JWT 토큰 저장
                navigate('/mypage');
            })
            .catch((error) => {
                console.error('로그인 실패', error);
            });
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="logo-box">
                    <img src={require('../assets/logo.png')} alt="logo" className="logo-img" />
                </div>

                <div className="login-box">
                    <div className="login-form">
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="remember-me">
                            <input type="checkbox" id="remember" name="remember" />
                            <label htmlFor="remember">아이디 저장</label>
                        </div>

                        <button className="login-btn" onClick={handleLogin}>로그인</button>

                        {/* 아이디 찾기 / 비밀번호 찾기 */}
                        <div className="helper-links">
                            <a href="/find-id">아이디 찾기</a>
                            <a href="/find-password">비밀번호 찾기</a>
                            <a href="/signup">회원 가입</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
