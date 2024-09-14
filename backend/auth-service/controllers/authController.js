const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 비밀번호 변경 처리
const updatePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const username = decoded.username;

    // DB에서 사용자 정보 가져오기
    db.query('SELECT password FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'DB 오류' });
        if (results.length === 0) return res.status(404).json({ message: '사용자가 존재하지 않습니다.' });

        const hashedPassword = results[0].password;

        // 현재 비밀번호 확인
        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (!isMatch) return res.status(401).json({ message: '현재 비밀번호가 일치하지 않습니다.' });

            // 새 비밀번호 암호화
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) return res.status(500).json({ message: '비밀번호 암호화 실패' });

                // DB에 새 비밀번호 저장
                db.query('UPDATE users SET password = ? WHERE username = ?', [hash, username], (err, results) => {
                    if (err) return res.status(500).json({ message: 'DB 업데이트 실패' });
                    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
                });
            });
        });
    });
};

module.exports = { updatePassword };
