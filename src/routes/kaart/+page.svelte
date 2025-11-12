<script>
    import Map from '$lib/components/Map.svelte';

    // data is populated by the server load (`+page.server.js`).
    // If the server load failed or returned nothing, fall back to a small sample.
    export let data;

    const sample = [
        {
            id: '1',
            street: 'Johan Cruijff Boulevard',
            house_number: '1',
            map: { coordinates: [4.942131736450486, 52.315393117430666] }
        }
    ];

    const mapAddresses = (data && data.mapAddresses && data.mapAddresses.length) ? data.mapAddresses : sample;
</script>

<div>
<Map {mapAddresses} />
</div>

<style>
    div {
        height: 100%;
        border-top: 7px solid var(--color-secondary);
    }
</style>