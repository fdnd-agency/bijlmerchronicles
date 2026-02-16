import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
    try {
        const lemmaSlug = params.slug;

        const url =
            `https://fdnd-agency.directus.app/items/emibazo_lemma` +
            `?filter[slug][_eq]=${lemmaSlug}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw error(500, 'Failed to fetch API');
        }

        const json = await response.json();
        const lemma = json.data?.[0];

        // ✅ handle missing slug properly
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
        error('Error fetching lemma from API:', err);

        // show proper error page instead of 500 crash
        throw error(500, 'Server error while loading lemma');
    }
}
