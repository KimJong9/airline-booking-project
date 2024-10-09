# Terraform과 EKS로 구현하는 MSA 기반 항공 예매 사이트

주제: 항공권 예약 시스템

구성: 프론트, 백엔드, 데이터베이스로 구성

구동 환경: AWS

프론트: React로 구성, npm으로 빌드, 클라우드 프론트의 AWS S3 원본 동작으로 웹 호스팅 사용

백엔드: Nodejs로 빌드, 도커 이미지로 만들어서 ECR에 적재 후 eks로 구동,

msa로 booking(항공 예약, 예약 이메일 전송 등), user(로그인, 회원가입, 회원 정보 관련 기능 등), flight(항공편 검색 등 항공편과 관련된 기능)로 기능들을 나눠서 쿠버네티스 구동

DB: AWS RDS의 Aurora postgreDB 사용



서비스 화면

[메인 화면]

![메인화면](https://github.com/user-attachments/assets/a9fbeccc-7da3-4c5c-a61c-b79701508acc)


[로그인 화면]

![로그인 화면](https://github.com/user-attachments/assets/7bb00a8b-3317-4bc1-baef-b1bee3540657)

[마이페이지 화면]

![마이페이지 화면](https://github.com/user-attachments/assets/95ad3efe-606f-4c71-9f2a-27402e4a00d8)

[비행기 검색 화면]

![비행기 예약 페이지](https://github.com/user-attachments/assets/ea27a98a-09ba-4e7f-a18d-0dab8de2eab2)

[검색 결과 화면]

![항공편 리스트 페이지 화면](https://github.com/user-attachments/assets/a8173ea5-4fea-48e6-a21c-b3d5ea387053)

[예약 완료 화면]


![결제완료화면](https://github.com/user-attachments/assets/1fe18559-8a5a-4d93-a5d4-3ba579fa0401)


예약 완료 시 마이페이지에서 예약이 추가된 것을 확인할 수 있습니다.


![예약정보확인화면](https://github.com/user-attachments/assets/a957684c-b416-46bc-b6d7-debc41a5deec)



프론트 엔드와 백엔드의 통신 시 백엔드 주소는 Login.js, BookingSection.js, MyPage.js, Payment.js, Signup.js 이렇게 5개 파일에서 apiURL을 설정하시면 됩니다.

DB 설정은 백엔드의 각 서비스의 config 폴더 안의 db.js를 수정하시면 됩니다.

작업 목록

9월 14일: 프론트 생성, 백엔드-User 생성

9월 15일: DB 연동 및 프론트,백엔드-User 연동

9월 16일: 백엔드 Flight 기능 구현

9월 17일: 백엔드 Booking 기능 구현, 도커 이미지 생성

9월 18일: CI-CD 구성
