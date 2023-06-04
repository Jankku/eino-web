module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  plugins: ['react', 'react-hooks', '@tanstack/query', 'testing-library', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/prop-types': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'warn',
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
