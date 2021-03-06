module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: `${__dirname}/tsconfig.json`,
      },
    },
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    'import/no-cycle': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'max-len': 'warn',
    'no-empty-function': 'off',
    'import/no-extraneous-dependencies': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        alwaysTryTypes: true,
        project: [`${__dirname}/tsconfig.json`],
      },
    },
  ],
};
