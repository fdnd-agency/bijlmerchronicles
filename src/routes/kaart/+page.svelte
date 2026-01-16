<script>
    import Map from '$lib/components/organisms/Map.svelte';

    // data inladen vanuit de server.js
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
    :root{
        --map-border-top-height: 7px;
    }

    div {
        height: 100%;
        border-top: var(--map-border-top-height) solid var(--color-secondary);
    }
    
    @supports (corner-shape: bevel) {
        div {
            corner-shape: bevel;
            border-top-right-radius: 100% 1rem;
            border-top: 0;
        }
}
    
    
</style>