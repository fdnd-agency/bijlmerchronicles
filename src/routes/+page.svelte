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

<h2>WIE ZIJN WIJ?</h2>
<p>Wij zijn een consortium van partners geworteld in Amsterdam-Zuidoost die zich inzetten om Amsterdam-Zuidoost beter op de hoogte te brengen.</p>
<p>We werken samen om het bestaande werk van gidsen, kenners, kunstenaars en ondernemers te versterken die de waarde van deze buurt al hebben laten zien.</p>

<Mapdetailtitle />

<Searchbar />

<Mappreview />

<style>
  
    h2 {
        font-size: var(--heading-2);
        font-family: var(--main-font-black);
        text-align: center;
    }
  
    p {
        font-size: var(--paragraph-3);
        line-height: 1.6;
        margin-bottom: 1.5rem;
        justify-self: center;
        max-width: 70vw;
        text-align: center;
    }
  
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