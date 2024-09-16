import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';
import Login from './components/Login';
import FindID from './components/FindID';  // 아이디 찾기 페이지
import Signup from './components/Signup';  // 회원가입 페이지
import FindPassword from './components/FindPassword';  // 비밀번호 찾기 페이지
import Home from './components/Home';
import './App.css';
import MyPage from "./components/MyPage";
import List from './components/List';
import Payment from "./components/Payment";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 관리

    return (
        <Router>
            <div>

                {/* 네비게이션 바 */}
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                {/* 메인 섹션 */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* 다른 라우트 추가 가능 */}
                    <Route path="/book-flight" element={<BookingSection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/find-id" element={<FindID />} />  {/* 아이디 찾기 페이지 */}
                    <Route path="/find-password" element={<FindPassword />} />  {/* 비밀번호 찾기 페이지 */}
                    <Route path="/signup" element={<Signup />} />  {/* 회원가입 페이지 */}
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/payment" element={<Payment />} />
                </Routes>

                {/* 하단 */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
