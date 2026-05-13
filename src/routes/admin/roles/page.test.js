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

describe('admin roles route', () => {
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

		it('redirects to home when user is moderator', async () => {
			// Arrange
			const event = createEvent({
				session: JSON.stringify({ id: 3, role: 3 }),
			});

			// Act
			const loadResult = load(event);

			// Assert
			await expect(loadResult).rejects.toMatchObject({
				status: 302,
				location: '/',
			});
		});

	
		it('returns empty users when Directus responds non-ok', async () => {
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
				users: [],
				user: { id: 9, role: 2 },
			});
		});

		it('returns empty users when fetch throws', async () => {
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
				users: [],
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

		it('returns no access for moderators', async () => {
			// Arrange
			const request = createRequestWithFormData([]);
			const fetch = vi.fn();
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 4, role: 3 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Geen toegang.' });
			expect(fetch).not.toHaveBeenCalled();
		});

		it('returns error when email is missing', async () => {
			// Arrange
			const request = createRequestWithFormData([['role', 'user']]);
			const fetch = vi.fn();
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Geen email opgegeven.' });
			expect(fetch).not.toHaveBeenCalled();
		});

		it('returns error when role is missing', async () => {
			// Arrange
			const request = createRequestWithFormData([['email', 'test@test.nl']]);
			const fetch = vi.fn();
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Geen rol opgegeven.' });
			expect(fetch).not.toHaveBeenCalled();
		});

		it('returns error for invalid role value', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'test@test.nl'],
				['role', 'superuser'],
			]);
			const fetch = vi.fn();
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Ongeldige rol.' });
			expect(fetch).not.toHaveBeenCalled();
		});

		it('resolves alias "user" to role 1 and succeeds', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'test@test.nl'],
				['role', 'user'],
			]);
			const fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: vi.fn().mockResolvedValue({
						data: [{ id: 7, email: 'test@test.nl', role: 1 }],
					}),
				})
				.mockResolvedValueOnce({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: true });
			const patchCall = fetch.mock.calls[1];
			expect(JSON.parse(patchCall[1].body)).toEqual({ role: 1 });
		});

		it('resolves alias "moderator" to role 3 and succeeds', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'mod@test.nl'],
				['role', 'moderator'],
			]);
			const fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: vi.fn().mockResolvedValue({
						data: [{ id: 8, email: 'mod@test.nl', role: 1 }],
					}),
				})
				.mockResolvedValueOnce({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: true });
			const patchCall = fetch.mock.calls[1];
			expect(JSON.parse(patchCall[1].body)).toEqual({ role: 3 });
		});

		it('returns error when user is not found in Directus', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'unknown@test.nl'],
				['role', '1'],
			]);
			const fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ data: [] }),
			});
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Gebruiker niet gevonden.' });
		});


		it('returns success when first PATCH fails but fallback PATCH succeeds', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'test@test.nl'],
				['role', '3'],
			]);
			const failResponse = {
				ok: false,
				status: 400,
				json: vi.fn().mockResolvedValue({ errors: [{ message: 'Failed' }] }),
			};
			const fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: vi.fn().mockResolvedValue({
						data: [{ id: 11, email: 'test@test.nl', role: 1 }],
					}),
				})
				.mockResolvedValueOnce(failResponse)
				.mockResolvedValueOnce({ ok: true });
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: true });
		});

		it('returns Directus error when all PATCHes fail', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'test@test.nl'],
				['role', '1'],
			]);
			const failResponse = {
				ok: false,
				status: 403,
				json: vi.fn().mockResolvedValue({ errors: [{ message: 'Forbidden.' }] }),
			};
			const fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: vi.fn().mockResolvedValue({
						data: [{ id: 12, email: 'test@test.nl', role: 3 }],
					}),
				})
				.mockResolvedValue(failResponse);
			const cookies = {
				get: vi.fn().mockReturnValue(JSON.stringify({ id: 2, role: 2 })),
			};

			// Act
			const result = await actions.upsert({ request, fetch, cookies });

			// Assert
			expect(result).toEqual({ success: false, error: 'Forbidden.' });
		});

		it('returns connection error when fetch throws', async () => {
			// Arrange
			const request = createRequestWithFormData([
				['email', 'test@test.nl'],
				['role', '1'],
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

	describe('integration flow', () => {
		it('updates a user role from load through upsert and is visible in a subsequent load', async () => {
			// Arrange
			const usersDb = [
				{ id: 2, email: 'admin@test.nl', role: 2 },
				{ id: 8, email: 'mod@test.nl', role: 1 },
			];
			const cloneUser = (user) => ({ ...user });

			const fetch = vi.fn().mockImplementation(async (url, options = {}) => {
				const method = options.method ?? 'GET';
				const parsedUrl = new URL(url);

				if (method === 'GET' && parsedUrl.pathname === '/items/emibazo_user') {
					const filterEmail = parsedUrl.searchParams.get('filter[email][_eq]');

					if (filterEmail) {
						const found = usersDb.find((u) => u.email === filterEmail);
						return {
							ok: true,
							json: vi.fn().mockResolvedValue({ data: found ? [cloneUser(found)] : [] }),
						};
					}

					return {
						ok: true,
						json: vi.fn().mockResolvedValue({ data: usersDb.map(cloneUser) }),
					};
				}

				if (method === 'PATCH' && parsedUrl.pathname.startsWith('/items/emibazo_user/')) {
					const id = Number(parsedUrl.pathname.split('/').at(-1));
					const body = JSON.parse(options.body ?? '{}');
					const target = usersDb.find((u) => u.id === id);

					if (!target) {
						return {
							ok: false,
							status: 404,
							json: vi.fn().mockResolvedValue({ errors: [{ message: 'Not found' }] }),
						};
					}

					target.role = Number(body.role);
					return { ok: true, json: vi.fn().mockResolvedValue({ data: target }) };
				}

				return {
					ok: false,
					status: 500,
					json: vi.fn().mockResolvedValue({ errors: [{ message: 'Unhandled mock route' }] }),
				};
			});

			const session = JSON.stringify({ id: 2, role: 2 });
			const loadEvent = createEvent({ session, fetch });

			// Act 1: load before update
			const before = await load(loadEvent);

			// Act 2: perform role update through action
			const request = createRequestWithFormData([
				['email', 'mod@test.nl'],
				['role', 'moderator'],
			]);
			const cookies = { get: vi.fn().mockReturnValue(session) };
			const actionResult = await actions.upsert({ request, fetch, cookies });

			// Act 3: load after update
			const after = await load(loadEvent);

			// Assert
			expect(before.users.find((u) => u.email === 'mod@test.nl')?.role).toBe(1);
			expect(actionResult).toEqual({ success: true });
			expect(after.users.find((u) => u.email === 'mod@test.nl')?.role).toBe(3);
		});
	});
});
