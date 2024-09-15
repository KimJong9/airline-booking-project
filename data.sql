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

INSERT INTO flight (flight_code, departure_airport_id, destination_airport_id, departure_date, departure_time, arrival_date, arrival_time, total_seats, remaining_seats, price) VALUES
    ('FL001', 1, 3, '2024-01-01', '10:00:00', '2024-01-01', '14:00:00', 200, 150, 300.00),
    ('FL002', 2, 4, '2024-01-02', '12:00:00', '2024-01-02', '18:00:00', 180, 100, 250.00);

INSERT INTO user_account (username, password, full_name, email, phone_number) VALUES
    ('user1', 'password123', 'John Doe', 'john@example.com', '123-456-7890'),
    ('user2', 'password456', 'Jane Smith', 'jane@example.com', '098-765-4321');

INSERT INTO booking (user_id, flight_code) VALUES
    (1, 'FL001'),
    (2, 'FL002');
