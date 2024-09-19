module.exports = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)/',  // axios를 Jest에서 변환 대상으로 포함
    ],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',  // CSS 파일들을 무시하거나 모킹 처리
    },
    testEnvironment: 'jsdom',  // React 컴포넌트 테스트를 위해 jsdom 환경 사용
};