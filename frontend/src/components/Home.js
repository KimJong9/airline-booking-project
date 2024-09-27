import React from 'react';
// import Navbar from './Navbar';
// import Footer from './Footer';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            {/* 중앙 로고 이미지 */}
            <div className="home-logo">
                <img src={require('../assets/home.png')} alt="logo" className="home-img" />
            </div>
        </div>
    );
}

export default Home;
