module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // важно для правил, которые требуют type information
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  rules: {
    // сюда можно добавлять свои правила или отключать нежелательные
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};