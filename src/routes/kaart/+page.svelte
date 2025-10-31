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
    img {
        width: 150px;
        height: 150px;
        height: auto;
        display: block;
    }
    div {
        display: flex;
        justify-content: space-around;
        overflow-x: auto;
    }
</style>