export const prerender = false;

// Helper: fetch with timeout
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { signal: controller.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
}

export async function load() {
    try {
        const res = await fetchWithTimeout(
            'https://fdnd-agency.directus.app/items/emibazo_persoon?fields=*',
            5000
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