export const prerender = false;

// Helper: fetch with timeout
async function fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { 
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'SvelteKit-App'
            }
        });
        return res;
    } finally {
        clearTimeout(id);
    }
}

export async function load({ params }) {
    const lemmaSlug = params.slug;
    const url = `https://fdnd-agency.directus.app/items/emibazo_lemma?filter[slug][_eq]=${encodeURIComponent(lemmaSlug)}`;

    try {
        const res = await fetchWithTimeout(url, 10000); // 10s timeout

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
                      bouwjaar: lemma.bouwjaar,
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