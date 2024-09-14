import React, { useState } from 'react';
import './FindPassword.css';

function FindPassword() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const handleFindPassword = () => {
        // 비밀번호 찾기 로직
        console.log('비밀번호 찾기 요청:', { email, username });
    };

    return (
        <div className="findpassword-container">
            <h2>비밀번호 찾기</h2>

            <label htmlFor="username">아이디</label>
            <input
                type="text"
                id="username"
                placeholder="가입한 아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="email">이메일</label>
            <input
                type="email"
                id="email"
                placeholder="가입한 이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleFindPassword}>비밀번호 찾기</button>

            {/* 아이디 찾기로 이동하는 링크 */}
            <div className="link-to-id">
                <a href="/find-id">아이디 찾기</a>
            </div>
        </div>
    );
}

export default FindPassword;
