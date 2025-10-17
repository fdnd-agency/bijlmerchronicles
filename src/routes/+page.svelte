<script>
    import { Mapdetailtitle } from '$lib';
    import { Searchbar } from '$lib';
    import { Mappreview } from '$lib';
</script>

<ul class="lemmacard-container">
    <Lemmacard imgname="lemmapngtest1"/>
    <Lemmacard imgname="lemmapngtest2"/>
    <Lemmacard imgname="lemmapngtest3"/>
    <Lemmacard imgname="lemmapngtest1"/>
    <Lemmacard imgname="lemmapngtest2"/>
    <Lemmacard imgname="lemmapngtest3"/>
</ul>

<Mapdetailtitle />

<Searchbar />

<Mappreview />

<style>
    .lemmacard-container {
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        list-style-type: none;
        width: 100vw;
        padding: 20px;
        margin: 0;
        display: flex;
        gap: 4vw;
    }
    @media (min-width: 700px) {
        .lemmacard-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4vw;
            width: max-content;
            justify-self: center;
        }
    }
</style>
