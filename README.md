# S3와 EKS로 구현하는 항공 예매 사이트

주제: 항공권 예약 시스템

구성: 프론트, 백엔드, 데이터베이스로 구성

구동 환경: AWS

프론트: Vue.js로 구성, npm으로 빌드, AWS S3 정적 호스팅 사용

API: aws appsync랑 amazon api gateway로 구성하여 front의 요청을 backend로 전달

백엔드: maven으로 빌드, 도커 이미지로 만들어거 eks로 구동 예정,

msa로 booking(항공 예약), payment(결제), auth(로그인, 회원가입), search(항공편 검색), info(마이페이지)로 기능들을 나눠서 도커 컨테이너로 구동

DB: AWS RDS 사용, postgreDB나 Mysql 사용


작업 목록

9월 14일: 프론트 생성, 백엔드-auth 생성

9월 15일: DB 연동 및 프론트,백엔드-auth 연동
