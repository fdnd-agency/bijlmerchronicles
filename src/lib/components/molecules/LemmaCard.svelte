<script>
    export let imgname = "lemmapngtest1";
</script>

<li>
    <a href="/"><span class="sr-only">Ga naar de blabla op de map </span>
        <img src="/{imgname}.png" alt="">
        <h2>Johan Cruijff Arena</h2>
    </a>
</li>

<style>
    :root{
        --border-radius-cards: 8px;
    }
/* --------------------------------------- Card box Styling ------------------------------------ */

    li {
        flex: 0 0 10%;
        scroll-snap-align: center;
        list-style-type: none;
        border-radius: var(--border-radius-cards);
        width: 100%;
        height: 100%;
        display: flex;

        a{
            position: relative;
            display: block;
            width: 12.5rem;
            height: 6.3rem;
            border-radius: var(--border-radius-cards);
                    
            &:nth-of-type(1n) {
                box-shadow: 0.3rem 0.3rem 0rem var(--color-primary-darkest);
            }
            &:nth-of-type(2n) {
                box-shadow: 0.3rem 0.3rem 0rem var(--color-secondary);
            }

        }

        &:nth-of-type(1n) {
            background-color: var(--color-tertiary);
        }
        &:nth-of-type(2n) {
            background-color: var(--color-primary);
        }

/* --------------------------------------- Colors for different h2's ------------------------------------ */

        &:nth-of-type(1n) h2 {
            color: var(--color-secondary);
        }
        
        &:nth-of-type(2n) h2 {
            color: var(--color-primary-darkest); 
        }

    }

/* --------------------------------------- Heading styling ------------------------------------ */

    a {
        h2 {
            display: block;
            position: absolute;
            transform: translateX(-50%) translateY(-0.1rem) scale(1.05);
            bottom: 0.1rem;
            left: 50%;
            margin: 0;
            justify-self: center;
            white-space: nowrap;
            font-size: 1.25rem;
        }

        @media (prefers-reduced-motion: no-preference) and (hover: hover){
            h2 {
                transform: translateX(-50%) translateY(0.6rem) scale(1.05);
                opacity: 0;
                transition:
                    opacity 0.25s ease-out,
                    transform 0.25s ease-out;
            }

            &:hover h2,
            &:focus-within h2 {
                opacity: 1;
                transform: translateX(-50%) translateY(0) scale(1.05);
            }
        }
        &:focus {
            outline: 2px solid var(--color-secondary);
            outline-offset: 0.6rem;
            box-shadow: none;
        }
    }

/* --------------------------------------- IMG STYLING ------------------------------------ */

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 1.25rem;
        transform: translateY(-0.6rem);
    }

</style>