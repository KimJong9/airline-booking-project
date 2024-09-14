-- 사용할 데이터베이스 선택
USE airline_booking; --추후 변경할 것

-- route 테이블
CREATE TABLE route (
    id VARCHAR(255) PRIMARY KEY,
    airport VARCHAR(32) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    route_code VARCHAR(255) NOT NULL UNIQUE
);

-- air_fare 테이블
CREATE TABLE air_fare (
    id VARCHAR(255) PRIMARY KEY,
    fare DOUBLE PRECISION NOT NULL,
    route_id VARCHAR(255),
    FOREIGN KEY (route_id) REFERENCES route(id) ON DELETE CASCADE
);

-- air_craft 테이블
CREATE TABLE air_craft (
    id VARCHAR(255) PRIMARY KEY,
    capacity INT NOT NULL,
    manufacture_date DATE,
    manufacturer VARCHAR(128),
    number VARCHAR(32) NOT NULL,
    flight_schedule_id VARCHAR(255),
    FOREIGN KEY (flight_schedule_id) REFERENCES flight_schedule(id) ON DELETE CASCADE
);

-- flight_schedule 테이블
CREATE TABLE flight_schedule (
    id VARCHAR(255) PRIMARY KEY,
    arrival DATE NOT NULL,
    departure DATE NOT NULL,
    flight_date DATE NOT NULL
);

-- passenger 테이블
CREATE TABLE passenger (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    address VARCHAR(64),
    age INT,
    nationality VARCHAR(16),
    flight_schedule_id VARCHAR(255),
    FOREIGN KEY (flight_schedule_id) REFERENCES flight_schedule(id) ON DELETE CASCADE
);

-- transaction 테이블
CREATE TABLE transaction (
    id VARCHAR(255) PRIMARY KEY,
    booking_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    type VARCHAR(16),
    flight_schedule_id VARCHAR(255),
    passenger_id VARCHAR(255),
    FOREIGN KEY (flight_schedule_id) REFERENCES flight_schedule(id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES passenger(id) ON DELETE CASCADE
);

-- country 테이블
CREATE TABLE country (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(32) NOT NULL
);

-- state 테이블
CREATE TABLE state (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    country_id VARCHAR(255),
    FOREIGN KEY (country_id) REFERENCES country(id) ON DELETE CASCADE
);

-- contact_detail 테이블
CREATE TABLE contact_detail (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(32) NOT NULL,
    phone VARCHAR(16),
    street VARCHAR(64),
    passenger_id VARCHAR(255),
    state_id VARCHAR(255),
    FOREIGN KEY (passenger_id) REFERENCES passenger(id) ON DELETE CASCADE,
    FOREIGN KEY (state_id) REFERENCES state(id) ON DELETE CASCADE
);
