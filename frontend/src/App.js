import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';
import Login from './components/Login';
import FindID from './components/FindID';  // 아이디 찾기 페이지
import Signup from './components/Signup';  // 회원가입 페이지
import FindPassword from './components/FindPassword';  // 비밀번호 찾기 페이지
import './App.css';


function App() {
    return (
        <Router>
            <div>
                {/* 네비게이션 바 */}
                <Navbar />

                {/* 메인 섹션 */}
                <Routes>
                    <Route path="/" element={<BookingSection />} />
                    {/* 다른 라우트 추가 가능 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/find-id" element={<FindID />} />  {/* 아이디 찾기 페이지 */}
                    <Route path="/find-password" element={<FindPassword />} />  {/* 비밀번호 찾기 페이지 */}
                    <Route path="/signup" element={<Signup />} />  {/* 회원가입 페이지 */}


                </Routes>

                {/* 하단 */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
