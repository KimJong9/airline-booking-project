-- 데이터 베이스 생성
CREATE DATABASE user;

-- 사용할 데이터베이스 선택
USE user;

-- 회원 정보 테이블
CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,          -- 숫자 기반 고유 식별자
    username VARCHAR(255) UNIQUE NOT NULL, -- 아이디 (고유값)
    password VARCHAR(255) NOT NULL,       -- 비밀번호
    full_name VARCHAR(255) NOT NULL,      -- 이름
    email VARCHAR(255) UNIQUE NOT NULL,   -- 이메일 (고유값)
    phone_number VARCHAR(15) NOT NULL     -- 휴대폰 번호
);

INSERT INTO user_account (username, password, full_name, email, phone_number) VALUES
    ('user1', 'password123', 'John Doe', 'john@example.com', '123-456-7890'),
    ('user2', 'password456', 'Jane Smith', 'jane@example.com', '098-765-4321');
