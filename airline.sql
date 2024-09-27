-- 데이터 베이스 생성
CREATE DATABASE airline;

-- 사용할 데이터베이스 선택
USE airline;

-- 나라와 도시 정보 테이블
CREATE TABLE country_city (
    country_name VARCHAR(255) NOT NULL,
    city_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (country_name, city_name)      -- 도시 이름
);

-- 공항 정보 테이블
CREATE TABLE airport (
    airport_id SERIAL PRIMARY KEY,          -- 숫자 기반의 고유 식별자
    airport_name VARCHAR(255) NOT NULL,
    city_name VARCHAR(255) NOT NULL,
    country_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (country_name, city_name) REFERENCES country_city(country_name, city_name) ON DELETE CASCADE
);

-- 항공 정보 테이블
CREATE TABLE flight (
    flight_code VARCHAR(255) PRIMARY KEY,  -- 고유 비행 코드
    departure_airport INT NOT NULL,     -- 출발 공항 ID
    destination_airport INT NOT NULL,   -- 도착 공항 ID
    departure_date DATE NOT NULL,          -- 출발 날짜
    departure_time TIME NOT NULL,          -- 출발 시간
    arrival_date DATE NOT NULL,            -- 도착 날짜
    arrival_time TIME NOT NULL,            -- 도착 시간
    total_seats INT NOT NULL,              -- 전체 좌석 수
    remaining_seats INT NOT NULL,          -- 남은 좌석 수
    price DECIMAL(10, 2) NOT NULL,         -- 가격
    FOREIGN KEY (departure_airport) REFERENCES airport(airport_name) ON DELETE CASCADE,
    FOREIGN KEY (destination_airport) REFERENCES airport(airport_name) ON DELETE CASCADE
);

INSERT INTO country_city (country_name, city_name) VALUES
    ('USA', 'New York'),
    ('USA', 'Los Angeles'),
    ('Korea', 'Seoul'),
    ('Japan', 'Tokyo');

INSERT INTO airport (airport_name, city_name, country_name) VALUES
    ('JFK Airport', 'New York', 'USA'),
    ('LAX Airport', 'Los Angeles', 'USA'),
    ('Incheon Airport', 'Seoul', 'Korea'),
    ('Narita Airport', 'Tokyo', 'Japan');

-- 출발 공항에서 도착 공항으로 가는 비행편 (2024-09-16)
INSERT INTO flight (flight_code, departure_airport, destination_airport, departure_date, departure_time, arrival_date, arrival_time, total_seats, remaining_seats, price)
VALUES
    ('ICN-NRT-001', 'Incheon Airport', 'JFK Airport', '2024-09-16', '10:00:00', '2024-09-16', '12:30:00', 180, 50, 300.00),  -- 인천 -> 도쿄
    ('ICN-SIN-002', 'Incheon Airport', 'Narita Airport', '2024-09-16', '14:00:00', '2024-09-16', '18:00:00', 200, 30, 450.00),  -- 인천 -> 싱가포르

-- 도착 공항에서 출발 공항으로 돌아오는 비행편 (2024-09-19)
    ('NRT-ICN-003', 'JFK Airport', 'Incheon Airport', '2024-09-19', '09:00:00', '2024-09-19', '11:30:00', 180, 40, 320.00),  -- 도쿄 -> 인천
    ('SIN-ICN-004', 'Narita Airport', 'Incheon Airport', '2024-09-19', '17:00:00', '2024-09-19', '21:00:00', 200, 20, 470.00);  -- 싱가포르 -> 인천


