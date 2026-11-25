const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettier = require('eslint-plugin-prettier')

module.exports = defineConfig([
  ...expoConfig,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/prefer-default-export': 'off',
      'react/state-in-constructor': 'off',
      'react/static-property-placement': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': 'off',
      'react/prop-types': 'off',
      'no-use-before-define': 'off',
      'no-param-reassign': 'off',
      'no-console': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
    },
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        __DEV__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
        requireConfigFile: false,
      },
    },
    ignores: ['dist/*'],
  },
])
