import argon2 from 'argon2';

export const prerender = false;

const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, fetch }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        // Server-side validation
        if (!email || !password || !confirmPassword) {
            return { success: false, error: 'Vul alle velden in.' };
        }

        if (password !== confirmPassword) {
            return {
                success: false,
                error: 'Wachtwoorden komen niet overeen.',
            };
        }

        if (password.length < 8) {
            return {
                success: false,
                error: 'Wachtwoord moet minimaal 8 tekens bevatten.',
            };
        }

        const passwordRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$',
        );
        if (!passwordRegex.test(password)) {
            return {
                success: false,
                error: 'Wachtwoord moet minimaal één hoofdletter,  één kleine letter, één cijfer en één speciaal teken bevatten.',
            };
        }

        try {
            const hashedPassword = await argon2.hash(password);

            const res = await fetch(`${DIRECTUS_BASE}/items/emibazo_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer mK0AWJSBAnjDmCmIPbH5QXovwbkIM2o4',
                },
                body: JSON.stringify({
                    email,
                    password: hashedPassword,
                    role: 1,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const msg =
                    body?.errors?.[0]?.message ||
                    'Er is iets misgegaan. Probeer het opnieuw.';
                // eslint-disable-next-line no-console
                console.error('Directus create user error:', res.status, msg);
                return { success: false, error: msg };
            }

            return { success: true };
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Registration fetch failed:', err);
            return {
                success: false,
                error: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
            };
        }
    },
};
