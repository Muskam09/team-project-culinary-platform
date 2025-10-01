module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',  // для src
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
  },
  overrides: [
    {
      files: [
        'vite.config.ts',
        'vite.*.ts',
        '*.config.ts'
      ],
      parserOptions: {
        project: './tsconfig.eslint.json', // окремий tsconfig для конфігурацій
        tsconfigRootDir: __dirname
      },
      rules: {
        'import/no-extraneous-dependencies': 'off'
      }
    }
  ]
};
