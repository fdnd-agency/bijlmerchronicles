export async function load() {
    const res = await fetch(
        'https://fdnd-agency.directus.app/items/emibazo_persoon?fields=*',
    );

    const json = await res.json();

    return {
        members: json.data ?? [],
    };
}
