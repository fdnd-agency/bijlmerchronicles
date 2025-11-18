<script>
    import { Searchbar } from '$lib';
    import { Mappreview } from '$lib';
    import { Lemmacard } from '$lib';
</script>

<h1><div class="h1-background"></div>ENCYCLOPEDIE MAPPING IMAGINARIES BIJLMER AMSTERDAM - ZUIDOOST</h1>

<section class="lemma-search-container">
    <Searchbar />
</section>

<div class = "lemmacard-container">
    <ul>
        <Lemmacard imgname="lemmapngtest1"/>
        <Lemmacard imgname="lemmapngtest2"/>
        <Lemmacard imgname="lemmapngtest3"/>
        <Lemmacard imgname="lemmapngtest1"/>
        <Lemmacard imgname="lemmapngtest2"/>
        <Lemmacard imgname="lemmapngtest3"/>
    </ul>
</div>

<section>
    <h3>WIE ZIJN WIJ?</h3>
    <p>Wij zijn een consortium van partners geworteld in Amsterdam-Zuidoost die zich inzetten om Amsterdam-Zuidoost beter op de hoogte te brengen.</p>
    <p>We werken samen om het bestaande werk van gidsen, kenners, kunstenaars en ondernemers te versterken die de waarde van deze buurt al hebben laten zien.</p>
</section>

<Mappreview />

<style>

/* --------------------------------------- Main heading styling (h1 and background off the h1) ------------------------------------ */

    h1{
        font-family: var(--main-font-black);
        font-size: var(--heading-1);
        color: var( --color-primary);
        position: relative;
        margin: 1.5rem 0rem 0rem 0rem;
        z-index: 2;
        width: 95vw;
        height: 40vh;
        min-height: 17rem;
        max-height: 18rem;
        display: flex;
        align-items: center;

        @media (min-width: 37.5rem){
            width: 60vw;
            height: 40vh;
        }

        /* h1 background */
        .h1-background{
            aspect-ratio: 2.592;
            clip-path: shape(from 0% 4.58%,curve to 2.55% 0.49% with 0% 1.18%/1.38% -1.03%,line to 18.02% 20.5%,curve to 18.64% 20.96% with 18.22% 20.75%/18.43% 20.91%,line to 46.73% 27.9%,line to 98.28% 31.68%,curve to 99.92% 37.63% with 99.46% 31.76%/100.27% 34.73%,line to 93.62% 89.17%,curve to 92% 92.36% with 93.4% 91.02%/92.74% 92.3%,line to 1.82% 100%,curve to 0% 95.42% with 0.83% 100.08%/0% 98.01%,vline to 4.58%,close);
            background-color: var(--color-secondary);
            position: absolute;
            left: -1rem;
            top: -2rem;
            width: 110%;
            height: 100%;
            z-index: -1;
        }

    }

/* --------------------------------------- Rest heading / font styling (h2, h3 and P's) ------------------------------------ */
  
    h2,h3 {
        font-size: var(--heading-2);
        font-family: var(--main-font-black);
        text-align: center;
    }

    h3{
        margin: 5rem 0 1.5rem 0;
    }

    p {
        font-size: var(--paragraph-3);
        margin-bottom: 1.5rem;
        justify-self: center;
        text-align: center;
        max-width: 70vw;
    }

/* --------------------------------------- Search (section) container styling ------------------------------------ */

    .lemma-search-container{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin: -2rem 0rem 3rem 0;
        padding: 2vw;
    }

/* --------------------------------------- Lemma card/cards styling (Lemma cards en responsiveness) ------------------------------------ */
    .lemmacard-container{
        overflow: clip;
        width: 99.8%;
        ul {
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
            list-style-type: none;
            width: 100vw;
            padding: 1.25rem;
            margin: 0;
            display: flex;
            gap: 4vw;
        }

        @media (min-width: 44rem) {
            ul {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 4vw;
                width: max-content;
                justify-self: center;
            }
        }
    }
    
</style>