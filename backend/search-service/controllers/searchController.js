const pool = require('../config/db');

// 사용자 정보 검색
exports.getUserInfo = async (req, res) => {
    const { username } = req.params;

    try {
        const result = await pool.query('SELECT full_name, username, email, phone_number FROM user_account WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('DB 검색 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
