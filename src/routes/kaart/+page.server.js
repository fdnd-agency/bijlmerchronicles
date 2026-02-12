// Link van de directus API ophalen
export async function load({ fetch }) {
    const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
    const link = `${DIRECTUS_BASE}/items/emibazo_lemma`;

    try {
        // fetch() haalt data op uit de API. Daarna word het omgezet in JSON zodat wij het kunnen gebruiken.
        const mapResponse = await fetch(link);
        const mapResponseJSON = await mapResponse.json();
        const items = mapResponseJSON.data;

        // Voor elk item worden alleen de benodigde velden meegenomen
        const mapAddresses = items.map((it) => {
            const posterimage_id = it.posterimage;
            const posterimage_url = posterimage_id;
            const geol = it.geolocation;

            return {
                id: it.id,
                slug: it.slug,
                title: it.title,
                street: it.address,
                summary: it.summary,
                body: it.body,
                posterimage: posterimage_id,
                posterimage_url,
                map: geol,
                date_created: it.date_created,
                date_updated: it.date_updated,
            };
        });

        return { mapAddresses };
    } catch (error) {
        // Als het fout gaat, log het de fout.
        error('Error fetching Directus items', error);
        return { mapAddresses: [] };
    }
}
