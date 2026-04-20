import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('argon2', () => ({
    default: {
        verify: vi.fn(),
    },
}));

import argon2 from 'argon2';
import { actions, prerender } from './+page.server.js';

const createRequestWithFormData = (entries) => ({
    formData: vi.fn().mockResolvedValue(new Map(entries)),
});

describe('inlog route action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('has prerender disabled', () => {
        // Arrange
        const expectedPrerender = false;

        // Act
        const actualPrerender = prerender;

        // Assert
        expect(actualPrerender).toBe(expectedPrerender);
    });

    it('returns an error when required fields are missing', async () => {
        // Arrange
        const request = createRequestWithFormData([['email', '']]);
        const fetch = vi.fn();
        const cookies = { set: vi.fn() };

        // Act
        const result = await actions.default({ request, fetch, cookies });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Vul alle velden in.',
        });
        expect(fetch).not.toHaveBeenCalled();
        expect(cookies.set).not.toHaveBeenCalled();
    });

    it('returns generic error when user fetch fails', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'test@example.com'],
            ['password', 'secret123'],
        ]);
        const fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: vi.fn().mockResolvedValue({ errors: [{ message: 'Boom' }] }),
        });
        const cookies = { set: vi.fn() };

        // Act
        const result = await actions.default({ request, fetch, cookies });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Er is iets misgegaan. Probeer het opnieuw.',
        });
        expect(cookies.set).not.toHaveBeenCalled();
    });

    it('returns invalid credentials when no user is found', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'nobody@example.com'],
            ['password', 'secret123'],
        ]);
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ data: [] }),
        });
        const cookies = { set: vi.fn() };

        // Act
        const result = await actions.default({ request, fetch, cookies });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Ongeldig e-mailadres of wachtwoord.',
        });
        expect(cookies.set).not.toHaveBeenCalled();
    });

    it('returns invalid credentials when password check fails', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'user@example.com'],
            ['password', 'wrong-password'],
        ]);
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: [
                    {
                        id: 1,
                        email: 'user@example.com',
                        password: 'hash',
                        role: 1,
                    },
                ],
            }),
        });
        const cookies = { set: vi.fn() };
        argon2.verify.mockResolvedValue(false);

        // Act
        const result = await actions.default({ request, fetch, cookies });

        // Assert
        expect(argon2.verify).toHaveBeenCalledWith('hash', 'wrong-password');
        expect(result).toEqual({
            success: false,
            error: 'Ongeldig e-mailadres of wachtwoord.',
        });
        expect(cookies.set).not.toHaveBeenCalled();
    });

    it('sets session cookie and redirects admin to /admin/persoon', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'admin@example.com'],
            ['password', 'correct-password'],
        ]);
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: [
                    {
                        id: 99,
                        email: 'admin@example.com',
                        password: 'admin-hash',
                        role: 2,
                    },
                ],
            }),
        });
        const cookies = { set: vi.fn() };
        argon2.verify.mockResolvedValue(true);

        // Act
        const actionResult = actions.default({ request, fetch, cookies });

        // Assert
        await expect(actionResult).rejects.toMatchObject({
            status: 302,
            location: '/admin/persoon',
        });
        expect(cookies.set).toHaveBeenCalledTimes(1);
    });

    it('sets session cookie and redirects non-admin to home', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'user@example.com'],
            ['password', 'correct-password'],
        ]);
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: [
                    {
                        id: 7,
                        email: 'user@example.com',
                        password: 'user-hash',
                        role: 1,
                    },
                ],
            }),
        });
        const cookies = { set: vi.fn() };
        argon2.verify.mockResolvedValue(true);

        // Act
        const actionResult = actions.default({ request, fetch, cookies });

        // Assert
        await expect(actionResult).rejects.toMatchObject({
            status: 302,
            location: '/',
        });
        expect(cookies.set).toHaveBeenCalledWith(
            'user_session',
            JSON.stringify({
                id: 7,
                email: 'user@example.com',
                role: 1,
            }),
            expect.objectContaining({
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 1,
            }),
        );
    });
});
