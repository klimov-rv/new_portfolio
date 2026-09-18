import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  globalIgnores([
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'dist_gh/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'app/components/feat/**',
    'app/components/ui/**',
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettierRecommended,
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },
  {
    files: ['scripts/**/*.js', 'headers.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'off',
    },
  },
);
