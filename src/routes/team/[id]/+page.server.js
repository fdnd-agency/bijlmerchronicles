export async function load({ fetch, params }) {
    const { id } = params; // Dit pakt de [id] uit de mapnaam/URL

    try {
        const urlAllLemmas = `https://fdnd-agency.directus.app/items/emibazo_lemma`;
        const urlAllPeople = `https://fdnd-agency.directus.app/items/emibazo_persoon`;

        const res = await fetch(
            `https://fdnd-agency.directus.app/items/emibazo_persoon/${id}`,
        );

        const resAllLemmas = await fetch(urlAllLemmas);
        const resAllPeople = await fetch(urlAllPeople);

        if (!res.ok || !resAllLemmas.ok || !resAllPeople.ok) {
            return { member: null, allLemmas: [], allPeople: [] };
        }

        const json = await res.json();
        const jsonAllLemmas = await resAllLemmas.json();
        const jsonAllPeople = await resAllPeople.json();
        const allLemmas = jsonAllLemmas.data ?? [];
        const allPeople = jsonAllPeople.data ?? [];

        // Directus geeft bij een specifiek ID vaak direct het object terug in 'data'
        return {
            member: json.data,
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
        console.error('Fout bij ophalen teamlid:', err);
        return { member: null, allLemmas: [], allPeople: [] };
    }
}
