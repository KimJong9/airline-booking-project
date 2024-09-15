const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 콜백 함수 불러오기

// 로그인
router.post('/login', authController.login);

// 회원가입
router.post('/signup', authController.signup);

// 아이디 중복 확인
router.post('/check-username', authController.checkUsername);

// 아이디 찾기
router.post('/find-id', authController.findId);

// 비밀번호 찾기
router.post('/find-password', authController.findPassword);

router.post('/update-password', authController.updatePassword);

module.exports = router;