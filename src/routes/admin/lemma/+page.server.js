import { redirect } from '@sveltejs/kit';

export const prerender = false;

const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
const TOKEN = 'mK0AWJSBAnjDmCmIPbH5QXovwbkIM2o4';

function normalizeBouwjaar(value) {
    const text = value?.toString?.().trim() ?? '';
    const match = text.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
}

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
            `${DIRECTUS_BASE}/items/emibazo_lemma?fields=*`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            },
        );

        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${res.status}`);
            return { lemmas: [], user };
        }

        const json = await res.json();
        return { lemmas: json.data ?? [], user };
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('SSR fetch failed for admin/lemma:', err);
        return { lemmas: [], user };
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
        const intent = formData.get('intent')?.toString().trim() || 'save';
        const id = formData.get('id')?.toString().trim() || null;
        const title = formData.get('title')?.toString().trim();
        const address = formData.get('address')?.toString().trim();
        const summary = formData.get('summary')?.toString().trim();
        const body = formData.get('body')?.toString().trim();
        const slug = formData.get('slug')?.toString().trim();
        const bouwjaarRaw = formData.get('bouwjaar')?.toString().trim();
        const bouwjaar = normalizeBouwjaar(bouwjaarRaw);
        const geoLat = formData.get('geo_lat')?.toString().trim();
        const geoLng = formData.get('geo_lng')?.toString().trim();
        const posterFile = formData.get('posterimage');

        // Build geolocation object if coordinates are provided
        let geolocation = null;
        if (geoLat && geoLng) {
            geolocation = {
                type: 'Point',
                coordinates: [parseFloat(geoLng), parseFloat(geoLat)],
            };
        }

        // Upload poster image to Directus files if one was provided
        let posterId = null;
        if (posterFile && posterFile.size > 0) {
            try {
                const fileForm = new FormData();
                fileForm.append('file', posterFile);
                const fileRes = await fetch(`${DIRECTUS_BASE}/files`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${TOKEN}` },
                    body: fileForm,
                });
                if (fileRes.ok) {
                    const fileJson = await fileRes.json();
                    posterId = fileJson.data?.id ?? null;
                } else {
                    // eslint-disable-next-line no-console
                    console.error('File upload failed:', fileRes.status);
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('File upload error:', err);
            }
        }

        const payload = { title, address, summary, body, slug, bouwjaar };
        if (geolocation) payload.geolocation = geolocation;
        if (posterId) payload.posterimage = posterId;

        try {
            let res;
            if (id) {
                res = await fetch(
                    `${DIRECTUS_BASE}/items/emibazo_lemma/${id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${TOKEN}`,
                        },
                        body: JSON.stringify(payload),
                    },
                );
            } else {
                res = await fetch(`${DIRECTUS_BASE}/items/emibazo_lemma`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                const msg =
                    errBody?.errors?.[0]?.message || `HTTP ${res.status}`;
                // eslint-disable-next-line no-console
                console.error('Directus lemma error:', msg);
                return { success: false, error: msg };
            }

            const responseBody = await res.json().catch(() => null);
            const savedId =
                responseBody?.data?.id ?? responseBody?.data?.[0]?.id ?? id;

            if (intent === 'preview') {
                if (!savedId) {
                    return {
                        success: false,
                        error: 'Preview kon niet worden geopend.',
                    };
                }

                return {
                    success: true,
                    lemmaId: savedId,
                    previewUrl: `/admin/lemma/preview?id=${encodeURIComponent(savedId)}`,
                };
            }

            return { success: true, lemmaId: savedId };
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
                `${DIRECTUS_BASE}/items/emibazo_lemma/${id}`,
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
