-- 데이터 베이스 생성
-- CREATE DATABASE airline_booking;

-- 사용할 데이터베이스 선택
-- USE airline_booking; --추후 변경할 것

-- 공항 정보 테이블
CREATE TABLE airport (
    airport_id SERIAL PRIMARY KEY,  -- 숫자 기반의 고유 식별자
    airport_name VARCHAR(255) NOT NULL,
    city_name VARCHAR(255) NOT NULL,
    country_name VARCHAR(255) NOT NULL
);

-- 항공 정보 테이블
CREATE TABLE flight (
    flight_code VARCHAR(255) PRIMARY KEY,  -- 고유 비행 코드
    departure_airport_id INT NOT NULL,     -- 출발 공항 ID
    destination_airport_id INT NOT NULL,   -- 도착 공항 ID
    departure_time TIMESTAMP NOT NULL,     -- 출발 날짜 및 시간
    arrival_time TIMESTAMP NOT NULL,       -- 도착 날짜 및 시간
    total_seats INT NOT NULL,              -- 전체 좌석 수
    remaining_seats INT NOT NULL,          -- 남은 좌석 수
    price DECIMAL(10, 2) NOT NULL,         -- 가격
    FOREIGN KEY (departure_airport_id) REFERENCES airport(airport_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_airport_id) REFERENCES airport(airport_id) ON DELETE CASCADE
);

-- 회원 정보 테이블
CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,          -- 숫자 기반 고유 식별자
    username VARCHAR(255) UNIQUE NOT NULL, -- 아이디 (고유값)
    password VARCHAR(255) NOT NULL,       -- 비밀번호
    full_name VARCHAR(255) NOT NULL,      -- 이름
    email VARCHAR(255) UNIQUE NOT NULL,   -- 이메일 (고유값)
    phone_number VARCHAR(15) NOT NULL     -- 휴대폰 번호
);

-- 예약 정보 테이블
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,        -- 예약 번호
    user_id INT NOT NULL,                 -- 회원 아이디 (참조)
    flight_code VARCHAR(255) NOT NULL,    -- 비행 코드 (참조)
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 예약 날짜
    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_code) REFERENCES flight(flight_code) ON DELETE CASCADE
);
