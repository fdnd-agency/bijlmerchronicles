export const prerender = false;

function normalizeBouwjaar(value) {
    const text = value?.toString?.().trim() ?? '';
    const match = text.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
}

export async function load({ params, fetch }) {
    const lemmaSlug = params.slug;
    const urlLemma = `https://fdnd-agency.directus.app/items/emibazo_lemma?filter[slug][_eq]=${encodeURIComponent(lemmaSlug)}`;
    const urlAllLemmas = `https://fdnd-agency.directus.app/items/emibazo_lemma`;
    const urlAllPeople = `https://fdnd-agency.directus.app/items/emibazo_persoon`;

    try {
        const resLemma = await fetch(urlLemma);
        const resAllLemmas = await fetch(urlAllLemmas);
        const resAllPeople = await fetch(urlAllPeople);

        if (!resLemma.ok || !resAllLemmas.ok || !resAllPeople.ok) {
            // SSR-safe logging
            // eslint-disable-next-line no-console
            console.error(`Directus API error: ${resLemma.status}`);
            return { lemma: null, allLemmas: [], allPeople: [] };
        }

        const jsonLemma = await resLemma.json();
        const jsonAllLemmas = await resAllLemmas.json();
        const jsonAllPeople = await resAllPeople.json();
        const lemma = jsonLemma.data?.[0] ?? null;
        const allLemmas = jsonAllLemmas.data ?? [];
        const allPeople = jsonAllPeople.data ?? [];

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
            allLemmas: allLemmas.map((l) => ({
                id: l.id,
                slug: l.slug,
                title: l.title,
            })),
            allPeople: allPeople.map((p) => ({
                id: p.id,
                name: p.name,
            })),
        };
    } catch (err) {
        // SSR-safe logging
        // eslint-disable-next-line no-console
        console.error('SSR fetch failed:', err);
        return { lemma: null, allLemmas: [], allPeople: [] };
    }
}
