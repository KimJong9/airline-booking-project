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
INSERT INTO flight (flight_code, departure_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, total_seats, remaining_seats, price)
VALUES
    ('ICN-NRT-001', 1, 2, '2024-09-16', '10:00:00', '2024-09-16', '12:30:00', 180, 50, 300.00),  -- 인천 -> 도쿄
    ('ICN-SIN-002', 1, 3, '2024-09-16', '14:00:00', '2024-09-16', '18:00:00', 200, 30, 450.00),  -- 인천 -> 싱가포르

-- 도착 공항에서 출발 공항으로 돌아오는 비행편 (2024-09-19)
    ('NRT-ICN-003', 2, 1, '2024-09-19', '09:00:00', '2024-09-19', '11:30:00', 180, 40, 320.00),  -- 도쿄 -> 인천
    ('SIN-ICN-004', 3, 1, '2024-09-19', '17:00:00', '2024-09-19', '21:00:00', 200, 20, 470.00);  -- 싱가포르 -> 인천

INSERT INTO user_account (username, password, full_name, email, phone_number) VALUES
    ('user1', 'password123', 'John Doe', 'john@example.com', '123-456-7890'),
    ('user2', 'password456', 'Jane Smith', 'jane@example.com', '098-765-4321');

INSERT INTO booking (username, flight_code) VALUES
    ('user1', 'FL001'),
    ('user2', 'FL002');
