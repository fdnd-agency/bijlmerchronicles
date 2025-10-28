<script>
    import Map from '$lib/components/Map.svelte';
</script>

<Map />

<div>
    <img src="/lemmapngtest1.png" alt="Footer Image">
    <img src="/lemmapngtest1.png" alt="Footer Image">
    <img src="/lemmapngtest1.png" alt="Footer Image">
    <img src="/lemmapngtest1.png" alt="Footer Image">
    <img src="/lemmapngtest1.png" alt="Footer Image">
</div>


<style>
    :global(footer) {
        background-color: var(--color-neutral);
    }
    img {
        width: 15vw;
        height: auto;
        display: block;
    }
    div {
        display: flex;
        gap: 2rem;
        justify-content: space-around;
    }
</style>