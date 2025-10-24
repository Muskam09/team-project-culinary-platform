module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true, // щоб ESLint знав про глобали jest
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "import"],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/setupTests.{js,jsx,ts,tsx}",
          "**/*.test.{js,jsx,ts,tsx}",
          "**/tests/**",
        ],
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
