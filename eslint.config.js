import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';

export default [
    js.configs.recommended,

    ...svelte.configs['flat/recommended'],

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
            'svelte/no-at-html-tags': 'error',
            'svelte/no-unused-svelte-ignore': 'error',
        },
    },
];
