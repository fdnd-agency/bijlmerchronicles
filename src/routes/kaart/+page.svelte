<script>
    import Map from '$lib/components/Map.svelte';

    // minimal sample data so the map can render out-of-the-box
    // coordinates are [lng, lat] in the source and the component reverses them
    // Leaflet expects coordinates as [lat, lng]. The original data used [lat, lng]
    // but the Map component currently reverses coordinates expecting [lng, lat].
    // To be safe, provide coordinates in [lng, lat] so the component's reverse()
    // call results in the correct [lat, lng] order.
    const mapAddresses = [
        {
            id: '1',
            street: 'Johan Cruijff Boulevard',
            house_number: '1',
            map: { coordinates: [4.942131736450486, 52.315393117430666] }
        },
        {
            id: '2',
            street: 'Bijlmerweg',
            house_number: '12A',
            map: { coordinates: [4.96610318962727, 52.319965790713674] }
        }
    ];
</script>

<Map {mapAddresses} />

<style>
</style>