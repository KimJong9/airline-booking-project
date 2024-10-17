-- 데이터 베이스 생성
CREATE DATABASE booking;

-- 사용할 데이터베이스 선택
USE booking;

-- 예약 정보 테이블
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,        -- 예약 번호
    username VARCHAR(255) NOT NULL,                 -- 회원 아이디 (참조)
    flight_code VARCHAR(255) NOT NULL,    -- 비행 코드 (참조)
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 예약 날짜
);

INSERT INTO booking (username, flight_code) VALUES
    ('user1', 'FL001'),
    ('user2', 'FL002');

-- DO $$ DECLARE r RECORD;
-- BEGIN
-- FOR r IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') LOOP
--     EXECUTE 'DROP TABLE IF EXISTS ' || r.table_name || ' CASCADE';
-- END LOOP;
-- END $$;
