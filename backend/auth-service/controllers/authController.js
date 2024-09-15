const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 로그인
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 회원 정보 조회
        const query = 'SELECT * FROM user_account WHERE username = $1';
        const { rows } = await pool.query(query, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const user = rows[0];

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        // JWT 발급
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.json({ message: '로그인 성공', token });
    } catch (err) {
        console.error('로그인 실패:', err);
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
};

// 회원가입
const signup = async (req, res) => {
    const { username, password, full_name, email, phone_number } = req.body;

    try {
        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 회원 정보 저장
        const query = `INSERT INTO user_account (username, password, full_name, email, phone_number)  VALUES ($1, $2, $3, $4, $5)`;
        const values = [username, hashedPassword, full_name, email, phone_number];

        await pool.query(query, values);
        res.status(201).json({ message: '회원 가입이 성공적으로 완료되었습니다.' });
    } catch (err) {
        console.error('회원 가입 실패:', err);
        res.status(500).json({ message: '회원 가입 중 오류가 발생했습니다.' });
    }
};

// 아이디 중복 확인
const checkUsername = async (req, res) => {
    const { username } = req.body;

    try {
        const result = await pool.query('SELECT * FROM user_account WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.status(409).json({ message: 'Username is already taken' });
        } else {
            return res.status(200).json({ message: 'Username is available' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database query error', error: err });
    }
};

// 아이디 찾기
const findId = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT username FROM user_account WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const userId = result.rows[0].username;
            return res.status(200).json({ message: `Your ID is: ${userId}` });
        } else {
            return res.status(404).json({ message: 'Email not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database query error', error: err });
    }
};

// 비밀번호 찾기
const findPassword = async (req, res) => {
    const { username, email } = req.body;

    try {
        const result = await pool.query('SELECT * FROM user_account WHERE username = $1 AND email = $2', [username, email]);
        if (result.rows.length > 0) {
            const tempPassword = 'temporaryPassword123'; // 임시 비밀번호 생성 로직
            const hashedTempPassword = await bcrypt.hash(tempPassword, 10); // 임시 비밀번호 암호화

            // 비밀번호 업데이트 로직
            await pool.query('UPDATE user_account SET password = $1 WHERE username = $2 AND email = $3', [hashedTempPassword, username, email]);

            return res.status(200).json({ message: 'Temporary password sent to your email' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database query error', error: err });
    }
};

// 비밀번호 변경 처리
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        const username = decoded.username;

        // DB에서 사용자 정보 가져오기
        const result = await pool.query('SELECT password FROM user_account WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '사용자가 존재하지 않습니다.' });
        }

        const hashedPassword = result.rows[0].password;

        // 현재 비밀번호 확인
        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
        }

        // 새 비밀번호 암호화
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // DB에 새 비밀번호 저장
        await pool.query('UPDATE user_account SET password = $1 WHERE username = $2', [hashedNewPassword, username]);

        res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류', error: err });
    }
};

module.exports = {
    login,
    signup,
    checkUsername,
    findId,
    findPassword,
    updatePassword
};
