<script>
    import { SearchBar } from '$lib';
    import { MapPreview } from '$lib';
    import { LemmaCard } from '$lib';
</script>

<svelte:head>
	<title>Encyclopédie Mapping Bijlmer Zuid-Oost: De Bijlmer Wiki</title>
	<meta property="og:title" content="Encyclopédie Mapping Bijlmer Zuid-Oost: De Bijlmer Wiki" />
    <meta property="og:description" name="description" content="Ontdek de rijke geschiedenis en cultuur van Amsterdam-Zuidoost met onze Encyclopédie Mapping Bijlmer." />
</svelte:head>

<h1><div class="h1-background"></div>ENCYCLOPEDIE MAPPING IMAGINARIES BIJLMER AMSTERDAM - ZUIDOOST</h1>

<section class="lemma-search-container">
    <SearchBar />
</section>

<div class = "lemmacard-container">
    <ul>
        <LemmaCard imgname="lemmapngtest1"/>
        <LemmaCard imgname="lemmapngtest2"/>
        <LemmaCard imgname="lemmapngtest3"/>
        <LemmaCard imgname="lemmapngtest1"/>
        <LemmaCard imgname="lemmapngtest2"/>
        <LemmaCard imgname="lemmapngtest3"/>
    </ul>
</div>

<section>
    <h3>WIE ZIJN WIJ?</h3>
    <p>Wij zijn een consortium van partners geworteld in Amsterdam-Zuidoost die zich inzetten om Amsterdam-Zuidoost beter op de hoogte te brengen.</p>
    <p>We werken samen om het bestaande werk van gidsen, kenners, kunstenaars en ondernemers te versterken die de waarde van deze buurt al hebben laten zien.</p>
</section>

<MapPreview />

<style>

/* --------------------------------------- Main heading styling (h1 and background off the h1) ------------------------------------ */
    h1{
        font-family: var(--main-font-black);
        font-size: var(--heading-1);
        color: var( --color-primary);
        position: relative;
        margin: -3.25rem 0rem 0rem 0rem;
        padding-left: 1.25rem;
        z-index: 2;
        max-width: 85vw;
        height: 40vh;
        min-height: 17rem;
        max-height: 18rem;
        display: flex;
        align-items: center;
        text-wrap: balance;

        @media (min-width: 37.5rem){
            width: 60vw;
            height: 40vh;
        }

        @supports (clip-path: shape(from 97.54% 10.91%,curve by -10.93% -10.76% with -2.11% -5.38%/-6.13% -9.91%,curve by -15.78% 7.98% with -5.83% -1.03%/-11.32% 3.26%,curve by -14.36% 12.27% with -4.46% 4.71%/-8.72% 10.15%,curve by -30.93% -4.53% with -10.05% 3.75%/-20.44% -4.47%,curve to 7.15% 25.66% with 18.67% 15.81%/11.86% 19.43%,curve by 19.9% 70.23% with -17.4% 23.09%/-0.05% 60.08%,curve by 49.46% -9.07% with 16.08% 8.22%/35.34% 3.57%,curve by 23.23% -53.55% with 13.43% -12.03%/21.71% -33.18%,curve by 0.25% -4.77% with 0.1% -1.63%/0.2% -3.2%,curve to 97.54% 10.91% with 100.09% 22.46%/99.64% 16.29%,close)){

            /* h1 background */
            .h1-background{
                aspect-ratio: 2.592;
                clip-path: shape(from 0% 4.58%,curve to 2.55% 0.49% with 0% 1.18%/1.38% -1.03%,line to 18.02% 20.5%,curve to 18.64% 20.96% with 18.22% 20.75%/18.43% 20.91%,line to 46.73% 27.9%,line to 98.28% 31.68%,curve to 99.92% 37.63% with 99.46% 31.76%/100.27% 34.73%,line to 93.62% 89.17%,curve to 92% 92.36% with 93.4% 91.02%/92.74% 92.3%,line to 1.82% 100%,curve to 0% 95.42% with 0.83% 100.08%/0% 98.01%,vline to 4.58%,close);
                background-color: var(--color-secondary);
                position: absolute;
                left: -1rem;
                top: -2rem;
                width: calc(100% + 10vw);
                height: 100%;
                z-index: -1;
            }
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
        text-align: center;
        margin: 0 15vw 1.5rem 15vw;
        @supports (justify-self: center){
            justify-self: center;
            max-width: 70vw;
            margin: 0 0 1.5rem 0;
        }
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
