import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('argon2', () => ({
    default: {
        hash: vi.fn(),
    },
}));

import argon2 from 'argon2';
import { actions, prerender } from './+page.server.js';

const emailExistsError =
    'Dit e-mailadres is al in gebruik. Log in of gebruik een ander e-mailadres.';

const createRequestWithFormData = (entries) => ({
    formData: vi.fn().mockResolvedValue(new Map(entries)),
});

describe('aanmelden route action', () => {
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

    it('returns error when required fields are missing', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'new@example.com'],
            ['password', 'Password1!'],
            ['confirmPassword', ''],
        ]);
        const fetch = vi.fn();

        // Act
        const result = await actions.default({ request, fetch });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Vul alle velden in.',
        });
        expect(argon2.hash).not.toHaveBeenCalled();
        expect(fetch).not.toHaveBeenCalled();
    });

    it('returns error when passwords do not match', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'new@example.com'],
            ['password', 'Password1!'],
            ['confirmPassword', 'Password2!'],
        ]);
        const fetch = vi.fn();

        // Act
        const result = await actions.default({ request, fetch });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Wachtwoorden komen niet overeen.',
        });
        expect(argon2.hash).not.toHaveBeenCalled();
        expect(fetch).not.toHaveBeenCalled();
    });

    it('returns error when password is too short', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'new@example.com'],
            ['password', 'Aa1!a'],
            ['confirmPassword', 'Aa1!a'],
        ]);
        const fetch = vi.fn();

        // Act
        const result = await actions.default({ request, fetch });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Wachtwoord moet minimaal 8 tekens bevatten.',
        });
        expect(argon2.hash).not.toHaveBeenCalled();
        expect(fetch).not.toHaveBeenCalled();
    });

    it('returns error when password does not meet complexity rules', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'new@example.com'],
            ['password', 'Password12'],
            ['confirmPassword', 'Password12'],
        ]);
        const fetch = vi.fn();

        // Act
        const result = await actions.default({ request, fetch });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Wachtwoord moet minimaal één hoofdletter,  één kleine letter, één cijfer en één speciaal teken bevatten.',
        });
        expect(argon2.hash).not.toHaveBeenCalled();
        expect(fetch).not.toHaveBeenCalled();
    });

    it('redirects to login when registration succeeds', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'new@example.com'],
            ['password', 'Password1!'],
            ['confirmPassword', 'Password1!'],
        ]);
        argon2.hash.mockResolvedValue('hashed-password');
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
        });

        // Act
        await expect(actions.default({ request, fetch })).rejects.toMatchObject({
            status: 303,
            location: '/inlog',
        });

        // Assert
        expect(argon2.hash).toHaveBeenCalledWith('Password1!');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'https://fdnd-agency.directus.app/items/emibazo_user',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: expect.stringContaining('Bearer '),
                }),
                body: JSON.stringify({
                    email: 'new@example.com',
                    password: 'hashed-password',
                    role: 1,
                }),
            }),
        );
    });

    it('returns a friendly message when Directus create user fails because the email already exists', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'existing@example.com'],
            ['password', 'Password1!'],
            ['confirmPassword', 'Password1!'],
        ]);
        argon2.hash.mockResolvedValue('hashed-password');
        const fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 400,
            json: vi.fn().mockResolvedValue({
                errors: [{ message: 'Email bestaat al.' }],
            }),
        });

        // Act
        const result = await actions.default({ request, fetch });

        // Assert
        expect(result).toEqual({
            success: false,
            error: emailExistsError,
        });
    });

    it('returns connection error when hashing or request throws', async () => {
        // Arrange
        const request = createRequestWithFormData([
            ['email', 'new@example.com'],
            ['password', 'Password1!'],
            ['confirmPassword', 'Password1!'],
        ]);
        argon2.hash.mockRejectedValue(new Error('hash failed'));
        const fetch = vi.fn();

        // Act
        const result = await actions.default({ request, fetch });

        // Assert
        expect(result).toEqual({
            success: false,
            error: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
        });
    });
});
