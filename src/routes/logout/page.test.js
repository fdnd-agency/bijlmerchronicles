import { describe, expect, it, vi } from 'vitest';
import { actions, prerender } from './+page.server.js';

describe('logout route', () => {
    it('has prerender disabled', () => {
        // Arrange
        const expectedPrerender = false;

        // Act
        const actualPrerender = prerender;

        // Assert
        expect(actualPrerender).toBe(expectedPrerender);
    });

    it('deletes the user_session cookie and redirects to home', async () => {
        // Arrange
        const cookies = {
            delete: vi.fn(),
        };

        // Act
        const actionResult = actions.default({ cookies });

        // Assert
        await expect(actionResult).rejects.toMatchObject({
            status: 302,
            location: '/',
        });

        expect(cookies.delete).toHaveBeenCalledTimes(1);
        expect(cookies.delete).toHaveBeenCalledWith('user_session', {
            path: '/',
        });
    });
});
