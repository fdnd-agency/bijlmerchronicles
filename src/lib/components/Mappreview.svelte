<script>
    import { Mapdetailtitle } from '$lib';
</script>

<section>
    <div class="intersection-shape"></div>
    <h3><div class="background-heading"></div>Bekijk de lemma's</h3>
    <img src="/mapimage.png" alt="foto van de kaart van de bijlmer">
    <a href="/">Ontdek meer</a>
    <Mapdetailtitle />
</section>

<style>

/* --------------------------------------- Section styling ------------------------------------ */
    section {
        position: relative;
        margin-top: 7rem;
        height: 40vh;
        width: 100%;
    }

/* --------------------------------------- Heading (h3) background + H3 Styling------------------------------------ */

    .background-heading {
        position: absolute;
        width: 150%;
        height: 300%;
        min-height: 7rem;
        right: -1rem;
        top: -2rem;
        aspect-ratio: 3.118;
        clip-path: shape(from 100% 94%,curve to 97.64% 99.87% with 100% 97.81%/98.85% 100.66%,line to 82.91% 90.36%,line to 58.41% 73.64%,curve to 58.05% 73.5% with 58.29% 73.56%/58.17% 73.51%,line to 4.68% 67.74%,curve to 2.82% 62.84% with 3.76% 67.64%/2.99% 65.6%,line to 0.03% 16.72%,curve to 1.9% 9.63% with -0.19% 13.11%/0.7% 9.75%,line to 97.98% 0%,curve to 100% 6% with 99.08% -0.11%/100% 2.61%,vline to 94%,close);        background-color: var(--color-secondary);
        z-index: -1;
    }


    h3 {
        position: absolute;
        top: 0;
        right: 1rem;
        margin: 0;
        color: var(--color-primary);
        font-size: clamp(1.5rem, 5vw, 3rem);
        z-index: 2;
    }

/* --------------------------------------- Img (cover) and shape that's the same color as the background (intersection shape) that's top left ------------------------------------ */

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }

    .intersection-shape {
        aspect-ratio: 6.296;
        clip-path: shape(from 0% 0%,hline to 100%,line to 73.11% 36.4%,line to 0% 100%,vline to 0%,close);
        background-color: var(--color-background);
        position: absolute;
        width: 65%;
        height: 10vh;
        min-height: 3rem;
        left: 0;
        top: -0.2rem;
    }

/* --------------------------------------- Button styling (Button in the middle that redirects to new page) ------------------------------------ */
    a {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #717171c8;
        color: #FFFFFF;
        text-decoration: none;
        padding: .6em;
        border-radius: 0.6rem;
        font-size: 1.25rem;
        &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }
        @media (min-width: 37.5rem) {
            font-size: 1.5em;
            padding: .5em 1em;
        }
    }

</style>