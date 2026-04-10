export const prerender = false;

function normalizeBouwjaar(value) {
    const text = value?.toString?.().trim() ?? '';
    const match = text.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
}

export async function load({ params, fetch }) {
    const lemmaSlug = params.slug;
    const url = `https://fdnd-agency.directus.app/items/emibazo_lemma?filter[slug][_eq]=${encodeURIComponent(lemmaSlug)}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            // SSR-safe logging
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${res.status}`);
            return { lemma: null };
        }

        const json = await res.json();
        const lemma = json.data?.[0] ?? null;

        return {
            lemma: lemma
                ? {
                      id: lemma.id,
                      slug: lemma.slug,
                      title: lemma.title,
                      body: lemma.body,
                      address: lemma.address,
                      bouwjaar: normalizeBouwjaar(lemma.bouwjaar),
                  }
                : null,
        };
    } catch (err) {
        // SSR-safe logging
        // eslint-disable-next-line no-console
        console.error('SSR fetch failed:', err);
        return { lemma: null };
    }
}
