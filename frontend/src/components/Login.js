import React, { useState} from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Login(setIsLoggedIn, IsLoggedIn=false) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();  // useNavigate 훅 사용

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        try {
            const response = await axios.post(`${BACKEND_URL}/user/login`, {
                username,
                password,
            },{withCredentials: true });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                // 로그인 성공 시 페이지 이동
                navigate("/mypage");
            } else {
                // 로그인 실패 처리
                console.error("로그인 실패:", response.data.message);
            }
        } catch (error) {
            console.error("서버 에러:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="logo-box">
                    <img src={require('../assets/logo.png')} alt="logo" className="logo-img" />
                </div>

                <div className="login-box">
                    <form className="login-form" onSubmit={handleLogin}> {/* 엔터키로도 로그인 가능 */}
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="remember-me">
                            <input type="checkbox" id="remember" name="remember" />
                            <label htmlFor="remember">아이디 저장</label>
                        </div>

                        <button className="login-btn" type="submit">로그인</button> {/* 엔터 키로도 동작 */}
                    </form>

                    {/* 아이디 찾기 / 비밀번호 찾기 */}
                    <div className="helper-links">
                        <a href="/find-id">아이디 찾기</a>
                        <a href="/find-password">비밀번호 찾기</a>
                        <a href="/signup">회원 가입</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
