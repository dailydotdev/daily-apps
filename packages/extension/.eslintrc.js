module.exports = {
  root: true,
  env: {
    node: true,
    webextensions: true,
  },
  globals: {
    ga: true,
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
        ],
      },
    ],
    indent: [
      'error',
      2,
      {
        ignoredNodes: [
          'TemplateLiteral',
        ],
      },
    ],
    'template-curly-spacing': [
      'off',
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: [
    'graphql',
  ],
};
