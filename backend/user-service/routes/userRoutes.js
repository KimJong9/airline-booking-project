const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // 콜백 함수 불러오기

// 로그인
router.post('/login', userController.login);

// 회원가입
router.post('/signup', userController.signup);

// 아이디 중복 확인
router.post('/check-username', userController.checkUsername);

// 아이디 찾기
router.post('/find-id', userController.findId);

// 비밀번호 찾기
router.post('/find-password', userController.findPassword);

router.post('/update-password', userController.updatePassword);

router.get(':username', userController.getUserInfo);

module.exports = router;