const fabric = require('@umijs/fabric');
module.exports = {
  ...fabric.eslint,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    // 'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    page: 'writable',
    REACT_APP_ENV: 'writable',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/prop-types': 0,
    'import/no-cycle': 0,
    'eslint-comments/disable-enable-pair': 0,
    'import/no-mutable-exports': 0,
    'react/display-name': 0,
  },
};
