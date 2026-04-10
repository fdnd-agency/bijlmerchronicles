export async function load({ fetch, params }) {
    const { id } = params; // Dit pakt de [id] uit de mapnaam/URL

    try {
        const res = await fetch(
            `https://fdnd-agency.directus.app/items/emibazo_persoon/${id}`,
        );

        if (!res.ok) {
            return { member: null };
        }

        const json = await res.json();

        // Directus geeft bij een specifiek ID vaak direct het object terug in 'data'
        return {
            member: json.data,
        };
    } catch (err) {
        console.error('Fout bij ophalen teamlid:', err);
        return { member: null };
    }
}
