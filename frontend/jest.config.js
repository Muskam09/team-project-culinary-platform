/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts', // используем ts-jest
  testEnvironment: 'jsdom', // эмулируем браузер
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // можно использовать .ts вместо .js
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // мок стилей
    '\\.(png|jpg|jpeg|gif|webp|svg|mp4)$': '<rootDir>/__mocks__/fileMock.js', // мок изображений
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
