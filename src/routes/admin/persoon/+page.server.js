import { redirect } from '@sveltejs/kit';

export const prerender = false;

const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
const TOKEN = 'KgmHEY4JMPOziWmiyxp03MuT4mT26bcs';

export async function load({ fetch, cookies }) {
    const session = cookies.get('user_session');
    let user = null;
    if (session) {
        try {
            user = JSON.parse(session);
        } catch {
            /* ignore */
        }
    }

    // Only admins (role 2) may access this page
    if (!user || user.role !== 2) {
        throw redirect(302, '/');
    }

    try {
        const res = await fetch(
            `${DIRECTUS_BASE}/items/emibazo_persoon?fields=*`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            },
        );

        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${res.status}`);
            return { persons: [], user };
        }

        const json = await res.json();
        return { persons: json.data ?? [], user };
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('SSR fetch failed for admin/persoon:', err);
        return { persons: [], user };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    upsert: async ({ request, fetch, cookies }) => {
        const session = cookies.get('user_session');
        let user = null;
        if (session) {
            try {
                user = JSON.parse(session);
            } catch {
                /* ignore */
            }
        }

        // Only admins (role 2) may write
        if (!user || user.role !== 2) {
            return { success: false, error: 'Geen toegang.' };
        }

        const formData = await request.formData();
        const id = formData.get('id')?.toString().trim() || null;
        const name = formData.get('name')?.toString().trim();
        const role = formData.get('role')?.toString().trim();
        const bio = formData.get('bio')?.toString().trim();
        const photoFile = formData.get('photo');

        // Upload photo to Directus files if one was provided
        let photoId = null;
        if (photoFile && photoFile.size > 0) {
            try {
                const fileForm = new FormData();
                fileForm.append('file', photoFile);
                const fileRes = await fetch(`${DIRECTUS_BASE}/files`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${TOKEN}` },
                    body: fileForm,
                });
                if (fileRes.ok) {
                    const fileJson = await fileRes.json();
                    photoId = fileJson.data?.id ?? null;
                } else {
                    // eslint-disable-next-line no-console
                    console.error('File upload failed:', fileRes.status);
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('File upload error:', err);
            }
        }

        const body = { name, role, bio };
        if (photoId) body.picture = photoId;

        try {
            let res;
            if (id) {
                res = await fetch(
                    `${DIRECTUS_BASE}/items/emibazo_persoon/${id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${TOKEN}`,
                        },
                        body: JSON.stringify(body),
                    },
                );
            } else {
                res = await fetch(`${DIRECTUS_BASE}/items/emibazo_persoon`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: JSON.stringify(body),
                });
            }

            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                const msg =
                    errBody?.errors?.[0]?.message || `HTTP ${res.status}`;
                // eslint-disable-next-line no-console
                console.error('Directus persoon error:', msg);
                return { success: false, error: msg };
            }

            return { success: true };
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Fetch failed:', err);
            return {
                success: false,
                error: 'Kan geen verbinding maken met de server.',
            };
        }
    },

    delete: async ({ request, fetch, cookies }) => {
        const session = cookies.get('user_session');
        let user = null;
        if (session) {
            try {
                user = JSON.parse(session);
            } catch {
                /* ignore */
            }
        }

        if (!user || user.role !== 2) {
            return { success: false, error: 'Geen toegang.' };
        }

        const formData = await request.formData();
        const id = formData.get('id')?.toString().trim();

        if (!id) {
            return { success: false, error: 'Geen id opgegeven.' };
        }

        try {
            const res = await fetch(
                `${DIRECTUS_BASE}/items/emibazo_persoon/${id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${TOKEN}` },
                },
            );

            if (!res.ok && res.status !== 204) {
                const errBody = await res.json().catch(() => null);
                const msg =
                    errBody?.errors?.[0]?.message || `HTTP ${res.status}`;
                // eslint-disable-next-line no-console
                console.error('Directus delete error:', msg);
                return { success: false, error: msg };
            }

            return { success: true, deleted: true };
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Delete fetch failed:', err);
            return {
                success: false,
                error: 'Kan geen verbinding maken met de server.',
            };
        }
    },
};
