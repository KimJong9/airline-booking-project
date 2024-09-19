module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react'
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Babel로 변환
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)/'  // 'axios'를 변환하도록 제외
    ]
};
