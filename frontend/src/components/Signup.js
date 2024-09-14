import React, { useState } from 'react';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignup = () => {
        // 회원가입 로직 (서버로 데이터 전송 로직)
        console.log('회원가입 정보:', { name, username, password, email });
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>

            <label htmlFor="name">이름</label>
            <input
                type="text"
                id="name"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="username">아이디</label>
            <input
                type="text"
                id="username"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password">비밀번호</label>
            <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="email">이메일</label>
            <input
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSignup}>회원가입</button>
        </div>
    );
}

export default Signup;
