module.exports = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Babel로 변환 설정
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)/',  // axios를 변환 대상에서 제외하지 않음
    ],
};