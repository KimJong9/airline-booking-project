import React, { useState, useEffect } from 'react';
import './BookingSection.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // React Router 사용

function BookingSection() {
    // 출발지 상태
    const [departureCountries, setDepartureCountries] = useState([]);
    const [departureCities, setDepartureCities] = useState([]);
    const [departureAirports, setDepartureAirports] = useState([]);
    const [selectedDepartureCountry, setSelectedDepartureCountry] = useState('');
    const [selectedDepartureCity, setSelectedDepartureCity] = useState('');
    const [selectedDepartureAirport, setSelectedDepartureAirport] = useState('');
    const [departureDate, setDepartureDate] = useState('');

    // 도착지 상태
    const [arrivalCountries, setArrivalCountries] = useState([]);
    const [arrivalCities, setArrivalCities] = useState([]);
    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [selectedArrivalCountry, setSelectedArrivalCountry] = useState('');
    const [selectedArrivalCity, setSelectedArrivalCity] = useState('');
    const [selectedArrivalAirport, setSelectedArrivalAirport] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');

    const navigate = useNavigate();  // 페이지 이동을 위한 훅

    // 출발지 나라 목록 불러오기
    useEffect(() => {
        axios.get('http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/countries')
            .then((response) => setDepartureCountries(response.data))
            .catch((error) => console.error('나라 목록 가져오기 실패:', error));
    }, []);

    // 도착지 나라 목록 불러오기
    useEffect(() => {
        axios.get('http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/countries')
            .then((response) => setArrivalCountries(response.data))
            .catch((error) => console.error('나라 목록 가져오기 실패:', error));
    }, []);

    // 출발지 선택 시 도시 목록 불러오기
    useEffect(() => {
        if (selectedDepartureCountry) {
            axios.get(`http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/cities/${selectedDepartureCountry}`)
                .then((response) => setDepartureCities(response.data))
                .catch((error) => console.error('도시 목록 가져오기 실패:', error));
        }
    }, [selectedDepartureCountry]);

    // 도착지 선택 시 도시 목록 불러오기
    useEffect(() => {
        if (selectedArrivalCountry) {
            axios.get(`http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/cities/${selectedArrivalCountry}`)
                .then((response) => setArrivalCities(response.data))
                .catch((error) => console.error('도시 목록 가져오기 실패:', error));
        }
    }, [selectedArrivalCountry]);

    // 출발지 도시 선택 시 공항 목록 불러오기
    useEffect(() => {
        if (selectedDepartureCity) {
            axios.get(`http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/airports/${selectedDepartureCountry}/${selectedDepartureCity}`)
                .then((response) => setDepartureAirports(response.data))
                .catch((error) => console.error('공항 목록 가져오기 실패:', error));
        }
    }, [selectedDepartureCity, selectedDepartureCountry]);

    // 도착지 도시 선택 시 공항 목록 불러오기
    useEffect(() => {
        if (selectedArrivalCity) {
            axios.get(`http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/airports/${selectedArrivalCountry}/${selectedArrivalCity}`)
                .then((response) => setArrivalAirports(response.data))
                .catch((error) => console.error('공항 목록 가져오기 실패:', error));
        }
    }, [selectedArrivalCity, selectedArrivalCountry]);

    const handleSearch = () => {
        if (!selectedDepartureAirport || !departureDate || !selectedArrivalAirport || !arrivalDate) {
            alert('모든 항목을 입력하세요.');
            return;
        }

        axios.get(`http://JAWS-Airline-ALB-1027478753.ap-northeast-2.elb.amazonaws.com:5001/search/flights`, {
            params: {
                departureAirport: selectedDepartureAirport,
                departureDate,
                arrivalAirport: selectedArrivalAirport,
                arrivalDate
            }
        })
            .then((response) => {
                const flightData = response.data;
                console.log(flightData);
                navigate('/list', { state: { flights: flightData } });  // List 페이지로 데이터 전달
            })
            .catch((error) => console.error('항공편 검색 실패:', error));
    };

    return (
        <div className="booking-container">
            <h2>비행기 예약</h2>
            <div className="booking-section">
                {/* 출발지 */}
                <div className="departure-section">
                    <h3>출발지</h3>
                    <label>나라 선택</label>
                    <select onChange={(e) => setSelectedDepartureCountry(e.target.value)}>
                        <option value="">나라 선택</option>
                        {departureCountries.map((country) => (
                            <option key={country.country_name} value={country.country_name}>
                                {country.country_name}
                            </option>
                        ))}
                    </select>
                    <label>도시 선택</label>
                    <select onChange={(e) => setSelectedDepartureCity(e.target.value)} disabled={!selectedDepartureCountry}>
                        <option value="">도시 선택</option>
                        {departureCities.map((city) => (
                            <option key={city.city_name} value={city.city_name}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                    <label>공항 선택</label>
                    <select onChange={(e) => setSelectedDepartureAirport(e.target.value)} disabled={!selectedDepartureCity}>
                        <option value="">공항 선택</option>
                        {departureAirports.map((airport) => (
                            <option key={airport.airport_id} value={airport.airport_id}>
                                {airport.airport_name}
                            </option>
                        ))}
                    </select>
                    <label>가는 날</label> {/* 출발 날짜를 가는 날로 변경 */}
                    <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                </div>

                {/* 도착지 */}
                <div className="arrival-section">
                    <h3>도착지</h3>
                    <label>나라 선택</label>
                    <select onChange={(e) => setSelectedArrivalCountry(e.target.value)}>
                        <option value="">나라 선택</option>
                        {arrivalCountries.map((country) => (
                            <option key={country.country_name} value={country.country_name}>
                                {country.country_name}
                            </option>
                        ))}
                    </select>
                    <label>도시 선택</label>
                    <select onChange={(e) => setSelectedArrivalCity(e.target.value)} disabled={!selectedArrivalCountry}>
                        <option value="">도시 선택</option>
                        {arrivalCities.map((city) => (
                            <option key={city.city_name} value={city.city_name}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                    <label>공항 선택</label>
                    <select onChange={(e) => setSelectedArrivalAirport(e.target.value)} disabled={!selectedArrivalCity}>
                        <option value="">공항 선택</option>
                        {arrivalAirports.map((airport) => (
                            <option key={airport.airport_id} value={airport.airport_id}>
                                {airport.airport_name}
                            </option>
                        ))}
                    </select>
                    <label>오는 날</label> {/* 도착 날짜를 오는 날로 변경 */}
                    <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
                </div>
            </div>
            <button onClick={handleSearch}>항공편 검색</button>
        </div>
    );
}

export default BookingSection;
