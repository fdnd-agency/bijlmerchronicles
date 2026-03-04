export const prerender = false;

// Helper: fetch with timeout
async function fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'User-Agent': 'SvelteKit-App',
            },
        });
        return res;
    } finally {
        clearTimeout(id);
    }
}

export async function load() {
    const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
    const link = `${DIRECTUS_BASE}/items/emibazo_lemma`;

    try {
        const res = await fetchWithTimeout(link, 10000); // 10s timeout

        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${res.status}`);
            return { mapAddresses: [] };
        }

        const json = await res.json();
        const items = json.data ?? [];

        const mapAddresses = items.map((it) => ({
            id: it.id,
            slug: it.slug,
            title: it.title,
            street: it.address ?? '',
            summary: it.summary ?? '',
            body: it.body ?? '',
            posterimage: it.posterimage ?? null,
            posterimage_url: it.posterimage ?? null,
            map: it.geolocation ?? null,
            date_created: it.date_created ?? null,
            date_updated: it.date_updated ?? null,
        }));

        return { mapAddresses };
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Directus items', err);
        return { mapAddresses: [] };
    }
}
