import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
    js.configs.recommended,

    ...svelte.configs['flat/recommended'],

    {
        ignores: ['.netlify/**', 'build/**', '.svelte-kit/**'],
    },

    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },

    {
        files: ['**/*.js'],
        rules: {
            // Code conventies
            eqeqeq: ['error', 'always'],
            'prefer-const': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'warn',
        },
    },

    {
        files: ['**/*.svelte'],
        rules: {
            // Svelte-specifiek
            'svelte/no-at-html-tags': 'warn',
            'svelte/no-unused-svelte-ignore': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
];
