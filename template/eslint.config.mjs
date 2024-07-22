import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@react-native',
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.d.ts',
            '.android.js',
            '.android.jsx',
            '.android.ts',
            '.android.tsx',
            '.ios.js',
            '.ios.jsx',
            '.ios.ts',
            '.ios.tsx',
            '.web.js',
            '.web.jsx',
            '.web.ts',
            '.web.tsx',
          ],
        },
      },
    },

    rules: {
      'no-undef': 'off',

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      'max-params': ['error', 3],
      'no-empty-pattern': 1,
      '@typescript-eslint/no-empty-function': 1,
      '@typescript-eslint/ban-ts-comment': 2,
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/explicit-module-boundary-types': 0,

      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.tsx'],
        },
      ],

      'react-native/no-unused-styles': 2,
      'react-native/split-platform-components': 2,
      'react-native/no-inline-styles': 0,
      'react-native/no-color-literals': 0,
      'react-native/no-raw-text': 0,
      'import/no-extraneous-dependencies': 2,

      'import/extensions': [
        'error',
        'never',
        {
          svg: 'always',
        },
      ],

      'for-direction': 2,
      'no-cond-assign': 2,
      'no-constant-condition': 2,
      'no-inline-comments': 2,
      'no-promise-executor-return': 2,
      'no-fallthrough': 2,
      'no-dupe-args': 2,
      'no-dupe-keys': 2,
      'no-import-assign': 2,
      'no-dupe-else-if': 2,
      'no-duplicate-imports': 2,
      'no-ex-assign': 2,

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'export',
        },
        {
          blankLine: 'always',
          prev: 'break',
          next: ['case'],
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'default',
        },
        {
          blankLine: 'always',
          prev: ['import', 'cjs-import'],
          next: ['const', 'function', 'iife'],
        },
        {
          blankLine: 'always',

          prev: [
            'default',
            'block-like',
            'cjs-import',
            'cjs-export',
            'const',
            'function',
            'iife',
            'expression',
          ],

          next: '*',
        },
      ],

      'no-shadow': 0,

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'internal',
            'external',
            'builtin',
            'index',
            'sibling',
            'parent',
          ],

          pathGroups: [
            {
              pattern: 'react+(|-native)',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react+(|-*)',
              group: 'external',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: [],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/no-duplicates': 2,
      'import/no-useless-path-segments': 2,
      'import/prefer-default-export': 0,
      'import/named': 0,
      'import/namespace': 0,
      'import/default': 0,
      'import/no-named-as-default-member': 0,
      'import/no-named-as-default': 0,
      'import/no-unused-modules': 0,
      'import/no-deprecated': 0,
      '@typescript-eslint/indent': 0,
      'import/no-anonymous-default-export': [
        'error',
        {
          allowArray: true,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: true,
          allowNew: false,
          allowLiteral: false,
          allowObject: false,
        },
      ],
      'react-hooks/rules-of-hooks': 1,

      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useDidMount)',
        },
      ],

      'jest/no-identical-title': 2,
      'jest/valid-expect': 2,
      camelcase: 0,
      'prefer-destructuring': 2,
      'no-nested-ternary': 2,
      'comma-dangle': 0,

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
