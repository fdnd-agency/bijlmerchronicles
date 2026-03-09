export const prerender = false;

export async function load({ fetch }) {
    const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
    const link = `${DIRECTUS_BASE}/items/emibazo_lemma`;

    try {
        const res = await fetch(link);

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
