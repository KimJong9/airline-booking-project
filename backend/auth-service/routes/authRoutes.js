const express = require('express');
const { login, signup, checkUsername, findId, findPassword, updatePassword } = require('../controllers/authController');
const router = express.Router();

// 로그인
router.post('/login', login);

// 회원가입
router.post('/signup', signup);

// 아이디 중복 확인
router.post('/check-username', checkUsername);

// 아이디 찾기
router.post('/find-id', findId);

// 비밀번호 찾기
router.post('/find-password', findPassword);

router.post('/update-password', updatePassword);

module.exports = router;
