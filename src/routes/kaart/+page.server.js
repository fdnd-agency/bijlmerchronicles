// Link van de directus API ophalen
export const prerender = false;

export async function load() {
    const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
    const link = `${DIRECTUS_BASE}/items/emibazo_lemma`;

    try {
        const res = await fetch(link);

        // If API fails, return safe empty array instead of throwing
        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${res.status}`);
            return { mapAddresses: [] };
        }

        const json = await res.json();
        const items = json.data ?? [];

        // Voor elk item worden alleen de benodigde velden meegenomen
        const mapAddresses = items.map((it) => ({
            id: it.id,
            slug: it.slug,
            title: it.title,
            street: it.address,
            summary: it.summary,
            body: it.body,
            posterimage: it.posterimage,
            posterimage_url: it.posterimage,
            map: it.geolocation,
            date_created: it.date_created,
            date_updated: it.date_updated,
        }));

        return { mapAddresses };
    } catch (error) {
        // Als het fout gaat, log het de fout.
        // eslint-disable-next-line no-console
        console.error('Error fetching Directus items', error);
        return { mapAddresses: [] };
    }
}
