import React, { useEffect}  from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 라우팅 설정 시 사용
import './Navbar.css'; // 스타일링

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const Navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [setIsLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('token');  // 토큰 제거
        Navigate('/login');
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            {/* 로고 */}
            <div className="logo-container">
                <img src={require('../assets/logo.png')} alt="Logo" className="logo"/>
                <span className="logo-text">JAWS</span>
            </div>

            {/* 네비게이션 링크 */}
            <ul className="nav-links">
                <li><Link to="/">홈</Link></li>
                <li><Link to="/book-flight">비행기 예약</Link></li>
                {!isLoggedIn ? (
                    <>
                        <li><Link to="/login">로그인</Link></li>
                        <li><Link to="/signup">회원가입</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/mypage">마이페이지</Link></li>
                        <li onClick={handleLogout}>로그아웃</li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
