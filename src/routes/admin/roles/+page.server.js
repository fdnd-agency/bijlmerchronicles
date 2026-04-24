import { redirect } from '@sveltejs/kit';

export const prerender = false;

const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
const TOKEN = 'KgmHEY4JMPOziWmiyxp03MuT4mT26bcs';

// Role IDs in the backend: 1 = user, 2 = admin, 3 = moderator
const VALID_ROLES = [1, 2, 3];
const ROLE_ALIASES = {
	user: 1,
	admin: 2,
	moderator: 3,
};

function getUser(cookies) {
	const session = cookies.get('user_session');
	if (!session) return null;

	try {
		return JSON.parse(session);
	} catch {
		return null;
	}
}

export async function load({ fetch, cookies }) {
	const user = getUser(cookies);

	if (!user || user.role !== 2) {
		throw redirect(302, '/');
	}

	try {
		const res = await fetch(
			`${DIRECTUS_BASE}/items/emibazo_user`,
			{
				headers: { Authorization: `Bearer ${TOKEN}` },
			},
		);

		if (!res.ok) {
			// eslint-disable-next-line no-console
			console.error(`Directus API error: ${res.status}`);
			return { users: [], user };
		}

		const json = await res.json();
		return { users: json.data ?? [], user };
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('SSR fetch failed for admin/roles:', err);
		return { users: [], user };
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	upsert: async ({ request, fetch, cookies }) => {
		const user = getUser(cookies);

		if (!user || user.role !== 2) {
			return { success: false, error: 'Geen toegang.' };
		}

		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim() || null;
		const roleRaw = formData.get('role')?.toString().trim();

		if (!email) {
			return { success: false, error: 'Geen email opgegeven.' };
		}

		if (roleRaw === undefined || roleRaw === null || roleRaw === '') {
			return { success: false, error: 'Geen rol opgegeven.' };
		}

		const normalizedRole = ROLE_ALIASES[roleRaw?.toLowerCase?.()] ?? roleRaw;
		const role = Number(normalizedRole);

		if (!Number.isInteger(role) || !VALID_ROLES.includes(role)) {
			return { success: false, error: 'Ongeldige rol.' };
		}

		try {
			const res = await fetch(
				`${DIRECTUS_BASE}/items/emibazo_user?filter[email][_eq]=${encodeURIComponent(email)}&limit=1`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${TOKEN}`,
					},
				},
			);

			if (!res.ok) {
				const errBody = await res.json().catch(() => null);
				const msg = errBody?.errors?.[0]?.message || `HTTP ${res.status}`;
				// eslint-disable-next-line no-console
				console.error('Directus fetch user error:', msg);
				return { success: false, error: msg };
			}

			const userData = await res.json();
			const targetUser = userData.data?.[0];

			if (!targetUser) {
				return { success: false, error: 'Gebruiker niet gevonden.' };
			}

			if (Number(targetUser.role) === 2) {
				return { success: false, error: 'Kan de rol van een admin niet wijzigen.' };
			}

			const updateUrls = [];
			if (targetUser.id) {
				updateUrls.push(`${DIRECTUS_BASE}/items/emibazo_user/${targetUser.id}`);
			}
			updateUrls.push(`${DIRECTUS_BASE}/items/emibazo_user/${encodeURIComponent(email)}`);
			updateUrls.push(
				`${DIRECTUS_BASE}/items/emibazo_user?filter[email][_eq]=${encodeURIComponent(email)}`,
			);

			let lastError = 'Onbekende fout bij rol-update.';

			for (const updateUrl of updateUrls) {
				const updateRes = await fetch(updateUrl, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${TOKEN}`,
					},
					body: JSON.stringify({ role }),
				});

				if (updateRes.ok) {
					return { success: true };
				}

				const errBody = await updateRes.json().catch(() => null);
				lastError = errBody?.errors?.[0]?.message || `HTTP ${updateRes.status}`;
			}

			// eslint-disable-next-line no-console
			console.error('Directus role error:', lastError);
			return { success: false, error: lastError };

		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Role fetch failed:', err);
			return {
				success: false,
				error: 'Kan geen verbinding maken met de server.',
			};
		}
	},
};