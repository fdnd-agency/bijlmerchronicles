import { error } from '@sveltejs/kit';
export const ssr = false;
export const prerender = false;

export async function load({ params }) {
    const lemmaSlug = params.slug;

    const url =
        `https://fdnd-agency.directus.app/items/emibazo_lemma` +
        `?filter[slug][_eq]=${encodeURIComponent(lemmaSlug)}`;

    try {
        const response = await fetch(url);

        // If Directus itself fails → real server problem
        if (!response.ok) {
            throw error(response.status, 'Failed to fetch API');
        }

        const json = await response.json();
        const lemma = json.data?.[0] ?? null;

        // Proper 404 (allowed — does NOT crash SSR)
        if (!lemma) {
            throw error(404, 'Lemma not found');
        }

        return {
            lemma: {
                lemma: lemma.id,
                slug: lemma.slug,
                title: lemma.title,
                body: lemma.body,
                address: lemma.address,
                bouwjaar: lemma.bouwjaar
            }
        };

    } catch (err) {
        // IMPORTANT:
        // If it's already a SvelteKit HTTP error, rethrow it
        if (err?.status) {
            throw err;
        }

        // eslint-disable-next-line no-console
        console.error('Directus fetch failed:', err);

        // Instead of crashing SSR with 500,
        // return safe fallback data
        return {
            lemma: null
        };
    }
}