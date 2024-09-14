import React, { useState } from 'react';
import './FindID.css';

function FindID() {
    const [email, setEmail] = useState('');

    const handleFindID = () => {
        // 아이디 찾기 로직
        console.log('아이디 찾기 요청:', email);
    };

    return (
        <div className="findid-container">
            <h2>아이디 찾기</h2>
            <input
                type="email"
                placeholder="가입한 이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleFindID}>아이디 찾기</button>

            {/* 비밀번호 찾기로 이동하는 링크 */}
            <div className="link-to-password">
                <a href="/find-password">비밀번호 찾기</a>
            </div>
        </div>
    );
}

export default FindID;
