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

describe('admin persoon route', () => {
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

		it('redirects to home when session is invalid JSON', async () => {
			// Arrange
			const event = createEvent({ session: '{invalid-json' });

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
				session: JSON.stringify({ id: 3, role: 1 }),
			});

			// Act
			const loadResult = load(event);

			// Assert
			await expect(loadResult).rejects.toMatchObject({
				status: 302,
				location: '/',
			});
		});

		it('returns persons and user when Directus fetch succeeds', async () => {
			// Arrange
			const fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({
					data: [{ id: 1, name: 'Persoon 1' }],
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
				'https://fdnd-agency.directus.app/items/emibazo_persoon?fields=*',
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: expect.stringContaining('Bearer '),
					}),
				}),
			);
			expect(result).toEqual({
				persons: [{ id: 1, name: 'Persoon 1' }],
				user: { id: 9, role: 2 },
			});
		});

		it('returns empty persons when Directus responds non-ok', async () => {
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
				persons: [],
				user: { id: 9, role: 2 },
			});
		});

		it('returns empty persons when fetch throws', async () => {
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
				persons: [],
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 4, role: 1 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Geen toegang.' });
			expect(fetch).not.toHaveBeenCalled();
		});

		it('creates a person when no id is provided', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['name', 'Nieuwe Persoon'],
				['role', 'Onderzoeker'],
				['bio', 'Biografie'],
			]);
			const fetch = vi.fn().mockResolvedValue({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(fetch).toHaveBeenCalledWith(
				'https://fdnd-agency.directus.app/items/emibazo_persoon',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						'Content-Type': 'application/json',
						Authorization: expect.stringContaining('Bearer '),
					}),
					body: JSON.stringify({
						name: 'Nieuwe Persoon',
						role: 'Onderzoeker',
						bio: 'Biografie',
					}),
				}),
			);
			expect(result).toEqual({ success: true });
		});

		it('updates an existing person when id is provided', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['id', '88'],
				['name', 'Bijgewerkt'],
				['role', 'Rol'],
				['bio', 'Nieuwe bio'],
			]);
			const fetch = vi.fn().mockResolvedValue({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(fetch).toHaveBeenCalledWith(
				'https://fdnd-agency.directus.app/items/emibazo_persoon/88',
				expect.objectContaining({
					method: 'PATCH',
					body: JSON.stringify({
						name: 'Bijgewerkt',
						role: 'Rol',
						bio: 'Nieuwe bio',
					}),
				}),
			);
			expect(result).toEqual({ success: true });
		});

		it('uploads photo and includes picture id in payload when file upload succeeds', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['name', 'Met Foto'],
				['role', 'Fotograaf'],
				['bio', 'Heeft foto'],
				['photo', { size: 10 }],
			]);
			const fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: vi.fn().mockResolvedValue({ data: { id: 'file-123' } }),
				})
				.mockResolvedValueOnce({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(fetch).toHaveBeenCalledTimes(2);
			expect(fetch).toHaveBeenNthCalledWith(
				1,
				'https://fdnd-agency.directus.app/files',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						Authorization: expect.stringContaining('Bearer '),
					}),
					body: expect.any(FormData),
				}),
			);
			expect(fetch).toHaveBeenNthCalledWith(
				2,
				'https://fdnd-agency.directus.app/items/emibazo_persoon',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({
						name: 'Met Foto',
						role: 'Fotograaf',
						bio: 'Heeft foto',
						picture: 'file-123',
					}),
				}),
			);
			expect(result).toEqual({ success: true });
		});

		it('continues upsert without picture when file upload fails', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['name', 'Upload Fail'],
				['role', 'Role'],
				['bio', 'Bio'],
				['photo', { size: 10 }],
			]);
			const fetch = vi
				.fn()
				.mockResolvedValueOnce({ ok: false, status: 500 })
				.mockResolvedValueOnce({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(fetch).toHaveBeenCalledTimes(2);
			expect(fetch).toHaveBeenNthCalledWith(
				2,
				'https://fdnd-agency.directus.app/items/emibazo_persoon',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({
						name: 'Upload Fail',
						role: 'Role',
						bio: 'Bio',
					}),
				}),
			);
			expect(result).toEqual({ success: true });
		});

		it('returns API error when Directus upsert fails', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['name', 'Fout Persoon'],
				['role', 'Role'],
				['bio', 'Bio'],
			]);
			const fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 400,
				json: vi.fn().mockResolvedValue({
					errors: [{ message: 'Validation failed.' }],
				}),
			});
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
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
			const request = createRequestWithFormData([
				['name', 'Any Persoon'],
				['role', 'Role'],
				['bio', 'Bio'],
			]);
			const fetch = vi.fn().mockRejectedValue(new Error('network down'));
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 5, role: 1 })),
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.delete({ request, fetch, cookies });

			// Assert
			expect(fetch).toHaveBeenCalledWith(
				'https://fdnd-agency.directus.app/items/emibazo_persoon/42',
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
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
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
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
