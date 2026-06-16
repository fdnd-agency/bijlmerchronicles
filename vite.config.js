import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [enhancedImages(), sveltekit()],
    build: {
        minify: 'esbuild',
    },
    test: {
        // Playwright specs live in e2e/ and must not be collected by Vitest.
        exclude: [...configDefaults.exclude, 'e2e/**'],
    },
});
