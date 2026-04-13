import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load, prerender } from './+page.server.js';

const createEvent = ({
    session,
    url = 'http://localhost/admin/lemma/preview',
    fetch = vi.fn(),
} = {}) => ({
    url: new URL(url),
    fetch,
    cookies: {
        get: vi.fn().mockReturnValue(session),
    },
});

describe('admin lemma preview load', () => {
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

    it('redirects to home when no session exists', async () => {
        // Arrange
        const event = createEvent();

        // Act
        const loadResult = load(event);

        // Assert
        await expect(loadResult).rejects.toMatchObject({
            status: 302,
            location: '/',
        });
    });

    it('redirects to home when session is invalid JSON', async () => {
        // Arrange
        const event = createEvent({
            session: '{invalid',
        });

        // Act
        const loadResult = load(event);

        // Assert
        await expect(loadResult).rejects.toMatchObject({
            status: 302,
            location: '/',
        });
    });

    it('redirects to home when user is not admin', async () => {
        // Arrange
        const event = createEvent({
            session: JSON.stringify({ id: 7, role: 1 }),
        });

        // Act
        const loadResult = load(event);

        // Assert
        await expect(loadResult).rejects.toMatchObject({
            status: 302,
            location: '/',
        });
    });

    it('returns query-based draft and skips lemma fetch when no id is provided', async () => {
        // Arrange
        const fetch = vi.fn();
        const event = createEvent({
            session: JSON.stringify({ id: 99, role: 2 }),
            fetch,
            url: 'http://localhost/admin/lemma/preview?title=From%20Query&body=%3Cp%3Ebody%3C%2Fp%3E&bouwjaar=Gebouwd%20in%201984&geo_lat=52.37&geo_lng=4.89',
        });

        // Act
        const result = await load(event);

        // Assert
        expect(fetch).not.toHaveBeenCalled();
        expect(result).toEqual({
            draft: {
                id: null,
                title: 'From Query',
                address: '',
                summary: '',
                body: '<p>body</p>',
                slug: '',
                bouwjaar: '1984',
                geo_lat: '52.37',
                geo_lng: '4.89',
            },
        });
    });

    it('loads base lemma by id and fills missing fields from Directus', async () => {
        // Arrange
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: {
                    title: 'Base Title',
                    address: 'Base Address',
                    summary: 'Base Summary',
                    body: '<p>Base Body</p>',
                    slug: 'base-title',
                    bouwjaar: 'opgeleverd in 1993',
                },
            }),
        });
        const event = createEvent({
            session: JSON.stringify({ id: 1, role: 2 }),
            fetch,
            url: 'http://localhost/admin/lemma/preview?id=123',
        });

        // Act
        const result = await load(event);

        // Assert
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'https://fdnd-agency.directus.app/items/emibazo_lemma/123?fields=*',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining('Bearer '),
                }),
            }),
        );
        expect(result.draft).toEqual({
            id: '123',
            title: 'Base Title',
            address: 'Base Address',
            summary: 'Base Summary',
            body: '<p>Base Body</p>',
            slug: 'base-title',
            bouwjaar: '1993',
            geo_lat: '',
            geo_lng: '',
        });
    });

    it('prefers query params over fetched lemma values', async () => {
        // Arrange
        const fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                data: {
                    title: 'Base Title',
                    address: 'Base Address',
                    summary: 'Base Summary',
                    body: '<p>Base Body</p>',
                    slug: 'base-title',
                    bouwjaar: '1980',
                },
            }),
        });
        const event = createEvent({
            session: JSON.stringify({ id: 1, role: 2 }),
            fetch,
            url: 'http://localhost/admin/lemma/preview?id=9&title=Query%20Title&summary=Query%20Summary&bouwjaar=Build%201999',
        });

        // Act
        const result = await load(event);

        // Assert
        expect(result.draft.title).toBe('Query Title');
        expect(result.draft.summary).toBe('Query Summary');
        expect(result.draft.bouwjaar).toBe('1999');
        expect(result.draft.address).toBe('Base Address');
    });

    it('keeps draft usable when fetching base lemma fails', async () => {
        // Arrange
        const fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        const event = createEvent({
            session: JSON.stringify({ id: 1, role: 2 }),
            fetch,
            url: 'http://localhost/admin/lemma/preview?id=55&title=Fallback%20Title',
        });

        // Act
        const result = await load(event);

        // Assert
        expect(result).toEqual({
            draft: {
                id: '55',
                title: 'Fallback Title',
                address: '',
                summary: '',
                body: '',
                slug: '',
                bouwjaar: '',
                geo_lat: '',
                geo_lng: '',
            },
        });
    });

    it('keeps draft usable when fetch throws', async () => {
        // Arrange
        const fetch = vi.fn().mockRejectedValue(new Error('network down'));
        const event = createEvent({
            session: JSON.stringify({ id: 1, role: 2 }),
            fetch,
            url: 'http://localhost/admin/lemma/preview?id=77&slug=query-slug',
        });

        // Act
        const result = await load(event);

        // Assert
        expect(result.draft).toEqual({
            id: '77',
            title: '',
            address: '',
            summary: '',
            body: '',
            slug: 'query-slug',
            bouwjaar: '',
            geo_lat: '',
            geo_lng: '',
        });
    });
});
