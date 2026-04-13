import { beforeEach, describe, expect, it, vi } from 'vitest';
import { actions, load, prerender } from './+page.server.js';

const createEvent = ({ session, fetch = vi.fn() } = {}) => ({
    fetch,
    cookies: {
        get: vi.fn().mockReturnValue(session),
    },
});

const createRequestWithFormData = (entries) => ({
    formData: vi.fn().mockResolvedValue(new Map(entries)),
});

describe('admin lemma route', () => {
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

    describe('load', () => {
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

        it('redirects to home when user is not admin', async () => {
            // Arrange
            const event = createEvent({
                session: JSON.stringify({ id: 5, role: 1 }),
            });

            // Act
            const loadResult = load(event);

            // Assert
            await expect(loadResult).rejects.toMatchObject({
                status: 302,
                location: '/',
            });
        });

        it('returns lemmas and user when Directus fetch succeeds', async () => {
            // Arrange
            const fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({
                    data: [{ id: 1, title: 'Lemma 1' }],
                }),
            });
            const event = createEvent({
                session: JSON.stringify({ id: 9, role: 2 }),
                fetch,
            });

            // Act
            const result = await load(event);

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'https://fdnd-agency.directus.app/items/emibazo_lemma?fields=*',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: expect.stringContaining('Bearer '),
                    }),
                }),
            );
            expect(result).toEqual({
                lemmas: [{ id: 1, title: 'Lemma 1' }],
                user: { id: 9, role: 2 },
            });
        });

        it('returns empty lemmas when Directus responds non-ok', async () => {
            // Arrange
            const fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
            const event = createEvent({
                session: JSON.stringify({ id: 9, role: 2 }),
                fetch,
            });

            // Act
            const result = await load(event);

            // Assert
            expect(result).toEqual({
                lemmas: [],
                user: { id: 9, role: 2 },
            });
        });

        it('returns empty lemmas when fetch throws', async () => {
            // Arrange
            const fetch = vi.fn().mockRejectedValue(new Error('network fail'));
            const event = createEvent({
                session: JSON.stringify({ id: 9, role: 2 }),
                fetch,
            });

            // Act
            const result = await load(event);

            // Assert
            expect(result).toEqual({
                lemmas: [],
                user: { id: 9, role: 2 },
            });
        });
    });

    describe('actions.upsert', () => {
        it('returns no access for non-admin users', async () => {
            // Arrange
            const request = createRequestWithFormData([]);
            const fetch = vi.fn();
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 3, role: 1 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({ success: false, error: 'Geen toegang.' });
            expect(fetch).not.toHaveBeenCalled();
        });

        it('creates a lemma with normalized bouwjaar and geolocation', async () => {
            // Arrange
            const request = createRequestWithFormData([
                ['title', 'New Lemma'],
                ['address', 'Street 12'],
                ['summary', 'Summary'],
                ['body', '<p>Body</p>'],
                ['slug', 'new-lemma'],
                ['bouwjaar', 'Gebouwd in 1978'],
                ['geo_lat', '52.379'],
                ['geo_lng', '4.900'],
            ]);
            const fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 42 } }),
            });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith(
                'https://fdnd-agency.directus.app/items/emibazo_lemma',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        title: 'New Lemma',
                        address: 'Street 12',
                        summary: 'Summary',
                        body: '<p>Body</p>',
                        slug: 'new-lemma',
                        bouwjaar: '1978',
                        geolocation: {
                            type: 'Point',
                            coordinates: [4.9, 52.379],
                        },
                    }),
                }),
            );
            expect(result).toEqual({ success: true, lemmaId: 42 });
        });

        it('updates an existing lemma when id is provided', async () => {
            // Arrange
            const request = createRequestWithFormData([
                ['id', '88'],
                ['title', 'Updated'],
                ['address', 'Address'],
                ['summary', 'Summary'],
                ['body', 'Body'],
                ['slug', 'updated'],
                ['bouwjaar', '1991'],
            ]);
            const fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 88 } }),
            });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'https://fdnd-agency.directus.app/items/emibazo_lemma/88',
                expect.objectContaining({
                    method: 'PATCH',
                }),
            );
            expect(result).toEqual({ success: true, lemmaId: 88 });
        });

        it('returns preview URL for preview intent when saved id exists', async () => {
            // Arrange
            const request = createRequestWithFormData([
                ['intent', 'preview'],
                ['title', 'Preview Lemma'],
            ]);
            const fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 101 } }),
            });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({
                success: true,
                lemmaId: 101,
                previewUrl: '/admin/lemma/preview?id=101',
            });
        });

        it('returns error for preview intent when saved id cannot be resolved', async () => {
            // Arrange
            const request = createRequestWithFormData([
                ['intent', 'preview'],
                ['title', 'Preview Lemma'],
            ]);
            const fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: null }),
            });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({
                success: false,
                error: 'Preview kon niet worden geopend.',
            });
        });

        it('returns API error when Directus upsert fails', async () => {
            // Arrange
            const request = createRequestWithFormData([['title', 'Bad Lemma']]);
            const fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 400,
                json: vi.fn().mockResolvedValue({
                    errors: [{ message: 'Validation failed.' }],
                }),
            });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({
                success: false,
                error: 'Validation failed.',
            });
        });

        it('returns connection error when upsert throws', async () => {
            // Arrange
            const request = createRequestWithFormData([['title', 'Any Lemma']]);
            const fetch = vi.fn().mockRejectedValue(new Error('network down'));
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.upsert({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({
                success: false,
                error: 'Kan geen verbinding maken met de server.',
            });
        });
    });

    describe('actions.delete', () => {
        it('returns no access for non-admin users', async () => {
            // Arrange
            const request = createRequestWithFormData([['id', '5']]);
            const fetch = vi.fn();
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 3, role: 1 })),
            };

            // Act
            const result = await actions.delete({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({ success: false, error: 'Geen toegang.' });
            expect(fetch).not.toHaveBeenCalled();
        });

        it('returns error when id is missing', async () => {
            // Arrange
            const request = createRequestWithFormData([]);
            const fetch = vi.fn();
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.delete({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({
                success: false,
                error: 'Geen id opgegeven.',
            });
        });

        it('returns success when Directus delete succeeds', async () => {
            // Arrange
            const request = createRequestWithFormData([['id', '42']]);
            const fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.delete({ request, fetch, cookies });

            // Assert
            expect(fetch).toHaveBeenCalledWith(
                'https://fdnd-agency.directus.app/items/emibazo_lemma/42',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({
                        Authorization: expect.stringContaining('Bearer '),
                    }),
                }),
            );
            expect(result).toEqual({ success: true, deleted: true });
        });

        it('returns success for HTTP 204 response', async () => {
            // Arrange
            const request = createRequestWithFormData([['id', '42']]);
            const fetch = vi.fn().mockResolvedValue({ ok: false, status: 204 });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.delete({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({ success: true, deleted: true });
        });

        it('returns API error when delete fails', async () => {
            // Arrange
            const request = createRequestWithFormData([['id', '42']]);
            const fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 400,
                json: vi.fn().mockResolvedValue({
                    errors: [{ message: 'Cannot delete.' }],
                }),
            });
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.delete({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({ success: false, error: 'Cannot delete.' });
        });

        it('returns connection error when delete throws', async () => {
            // Arrange
            const request = createRequestWithFormData([['id', '42']]);
            const fetch = vi.fn().mockRejectedValue(new Error('network down'));
            const cookies = {
                get: vi
                    .fn()
                    .mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
            };

            // Act
            const result = await actions.delete({ request, fetch, cookies });

            // Assert
            expect(result).toEqual({
                success: false,
                error: 'Kan geen verbinding maken met de server.',
            });
        });
    });
});
