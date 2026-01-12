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

<svelte:head>
	<title>Lemma's op de kaart van de Bijlmer - Encyclopédie Mapping</title>
	<meta name="description" content="Bekijk alle lemma's van Amsterdam-Zuidoost en de Bijlmer." />
	<meta property="og:title" content="Lemma's op de kaart van de Bijlmer - Encyclopédie Mapping" />
	<meta property="og:description" content="Bekijk alle lemma's van Amsterdam-Zuidoost en de Bijlmer." />
</svelte:head>

<div>
<Map {mapAddresses} />
</div>

<style>
    div {
        height: 100%;
        border-top: 7px solid var(--color-secondary);
    }
</style>