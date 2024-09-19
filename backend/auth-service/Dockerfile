# Node.js 20 버전 이미지를 사용
FROM node:20

# 작업 디렉토리 생성
WORKDIR /usr/src/app

LABEL authors="outsi"

# package.json 및 package-lock.json 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --build-from-source

# 소스 코드 복사
COPY . .

# 서비스에서 사용할 포트 노출
EXPOSE 5000

# 서비스 실행 명령어
CMD ["npm", "start"]