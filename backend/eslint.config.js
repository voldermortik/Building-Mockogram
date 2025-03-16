import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import canonicalPlugin from 'eslint-plugin-canonical';
import eslintPluginJest from 'eslint-plugin-jest';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
    ]
  },
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'writable'
      }
    }
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'canonical': canonicalPlugin,
      'jest': eslintPluginJest
    },
    rules: {
      ...tsPlugin.configs.strict.rules,
      ...canonicalPlugin.configs.recommended.rules,
      ...eslintPluginJest.configs.recommended.rules,
      'canonical/destructuring-property-newline': 'off',
      'canonical/import-specifier-newline': 'off',
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
    rules: {
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error'
    }
  }
];
