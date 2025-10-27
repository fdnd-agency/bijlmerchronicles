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
            width: 200px;
            height: 100px;
            border-radius: var(--border-radius-cards);
                    
            &:nth-of-type(1n) {
                box-shadow: 5px 5px 0px var(--color-primary-darkest);
            }
            &:nth-of-type(2n) {
                box-shadow: 5px 5px 0px var(--color-secondary);
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
            opacity: 0  ;
            display: block;
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%) translateY(10px) scale(1.05);
            margin: 0;
            justify-self: center;
            white-space: nowrap;
            font-size: 1.25rem;
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

/* --------------------------------------- IMG STYLING ------------------------------------ */

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
        transform: translateY(-10px);
    }

</style>