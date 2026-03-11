import { redirect } from '@sveltejs/kit';
import argon2 from 'argon2';

export const prerender = false;

const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString();

        if (!email || !password) {
            return { success: false, error: 'Vul alle velden in.' };
        }

        try {
            // Fetch user by email — fetch all fields the token has access to
            const userRes = await fetch(
                `${DIRECTUS_BASE}/items/emibazo_user?filter[email][_eq]=${encodeURIComponent(email)}`,
                {
                    headers: {
                        Authorization: `Bearer mK0AWJSBAnjDmCmIPbH5QXovwbkIM2o4`,
                    },
                },
            );

            if (!userRes.ok) {
                const errBody = await userRes.json().catch(() => null);
                const msg =
                    errBody?.errors?.[0]?.message || `HTTP ${userRes.status}`;
                // eslint-disable-next-line no-console
                console.error('Directus user fetch error:', msg);
                return {
                    success: false,
                    error: 'Er is iets misgegaan. Probeer het opnieuw.',
                };
            }

            const userJson = await userRes.json();
            const users = userJson.data ?? [];

            if (users.length === 0) {
                return {
                    success: false,
                    error: 'Ongeldig e-mailadres of wachtwoord.',
                };
            }

            const user = users[0];

            // Verify password against the stored Argon2 hash
            const passwordMatch = await argon2.verify(user.password, password);
            if (!passwordMatch) {
                return {
                    success: false,
                    error: 'Ongeldig e-mailadres of wachtwoord.',
                };
            }

            // Store user info in a session cookie
            cookies.set(
                'user_session',
                JSON.stringify({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }),
                {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                },
            );

            // Admins (role === 2) go to /admin, everyone else to homepage
            if (user.role === 2) {
                throw redirect(302, '/admin');
            }

            throw redirect(302, '/');
        } catch (err) {
            // Re-throw SvelteKit redirects
            if (err?.status) throw err;

            // eslint-disable-next-line no-console
            console.error('Login fetch failed:', err);
            return {
                success: false,
                error: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
            };
        }
    },
};
