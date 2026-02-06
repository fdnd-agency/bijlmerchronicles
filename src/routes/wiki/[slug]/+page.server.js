export async function load({ params, fetch }) {
    try {
        // Haal het specifieke emibazo_lemma item op basis van de id uit de URL
        const lemmaSlug = params.slug;
        const emibazoApiUrl = `https://fdnd-agency.directus.app/items/emibazo_lemma?filter[slug][_eq]=${lemmaSlug}`;

        const emibazoLemmaResponse = await fetch(emibazoApiUrl);

        const emibazoLemmasData = await emibazoLemmaResponse.json();
        const lemma = emibazoLemmasData.data[0];

        // Retourneer alleen de benodigde velden voor de wiki pagina
        return {
            lemma: {
                lemma: lemma.id,
                slug: lemma.slug,
                title: lemma.title,
                body: lemma.body,
                address: lemma.address,
                bouwjaar: lemma.bouwjaar,
            },
        };

        // Foutafhandeling
    } catch (error) {
        console.error('Error fetching lemma from API', error);
        return { lemma: null };
    }
}
