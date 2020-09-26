module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser', // 指定ESLint要使用的解析器
  extends: [
    // 注意顺序
    // 使用eslint-plugin-react的推荐规则
    'plugin:react/recommended',
    // 使用@typescript-eslint/eslint-plugin的推荐规则
    'plugin:@typescript-eslint/recommended',
    // 使用eslint-config-prettier来禁用@typescript-eslint/eslint-plugin中与prettier冲突的ESLint规则
    'prettier/@typescript-eslint',
    // 启用eslint-plugin-prettier和eslint-config-prettier。这会将prettier错误作为ESLint错误来展示。确保这个配置放到数组的最后。
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018, // 允许解析较新的ES特性
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true   // 允许解析JSX
    }
  },
  settings: {
    react: {
      version: 'detect' // 告诉eslint-plugin-react自动检测要使用的React版本
    }
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    'comma-spacing': [2, { before: false, after: true }],
    // "comma-dangle": [2, "never"],
    camelcase: 'off',
    // 'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-this-alias': 0,
  },
};
