const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

const sharedGlobals = {
  console: 'readonly',
  document: 'readonly',
  fetch: 'readonly',
  FormData: 'readonly',
  HTMLElement: 'readonly',
  localStorage: 'readonly',
  module: 'readonly',
  navigator: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setInterval: 'readonly',
  setTimeout: 'readonly',
  clearInterval: 'readonly',
  clearTimeout: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  window: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  it: 'readonly',
  jest: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
};

module.exports = [
  {
    ignores: ['.next/**', 'coverage/**', 'dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: sharedGlobals,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
