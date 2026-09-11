import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        // Base rules for all files
        files: ['**/*.{js,jsx,ts,tsx}'],
        rules: {
            'complexity': ['error', { max: 10 }],
            'max-lines': ['error', 500],
            'no-alert': 'off',
            'no-console': 0,
            'no-eval': 'error',
            'no-extend-native': 0,
            curly: ['error', 'multi-line'],
            'prefer-regex-literals': 'off',
            'import/no-webpack-loader-syntax': 'off',
            'no-else-return': 0,
            'no-empty-function': 'error',
            'no-eq-null': 'error',
            'no-extra-parens': 'off',
            'no-labels': 'error',
            'no-new': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-loss-of-precision': 'error',
            'class-methods-use-this': 'off',
            'no-constructor-return': 'error',
            'no-promise-executor-return': 'error',
            'array-callback-return': 'error',
            'no-extra-bind': 'error',
            'no-implicit-coercion': 'error',
            'no-implicit-globals': 'error',
            'no-implied-eval': 'error',
            'no-invalid-this': 'off',
            'no-lone-blocks': 'error',
            'no-multi-spaces': 'error',
            'no-return-await': 'error',
            'no-self-compare': 'error',
            'no-unused-expressions': ['error', { allowTernary: true }],
            'no-unused-vars': 'off',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'no-void': 'error',
            radix: 'error',
            'require-await': 'off',
            'wrap-iife': ['error', 'inside'],
            'no-label-var': 'error',
            'no-undef-init': 'error',
            'no-use-before-define': ['error', { functions: false, classes: false }],
        },
    },
    {
        // Disable complexity rule only for React components
        files: ['**/components/**/*.{jsx,tsx}'],
        rules: {
            'complexity': 'off',
        },
    },
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'generated/prisma/**']),
]);

export default eslintConfig;
