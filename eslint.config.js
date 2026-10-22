import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintReact.configs.recommended,
  reactHooks.configs.flat.recommended,
  testingLibrary.configs['flat/react'],
  tanstackQuery.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@eslint-react/jsx-no-key-after-spread': 'off',
    },
    ignores: ['node_modules/', 'build/', 'playwright-report/', '.idea/', '.prettierrc'],
  },
]);
