export const prerender = false;

export async function load({ fetch }) {
    try {
        const res = await fetch(
            'https://fdnd-agency.directus.app/items/emibazo_persoon?fields=*',
        );

        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${res.status}`);
            return { members: [] };
        }

        const json = await res.json();
        return { members: json.data ?? [] };
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('SSR fetch failed for over-ons:', err);
        return { members: [] };
    }
}
