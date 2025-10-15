<script>
    const lemma = {
        title: "Johan Cruijff ArenA",
    }
</script>

<!-- PARENT RELATIEF MAKEN -->
<div class="container">
    <div class="shape1"></div>
    <article>
        <h4>{lemma.title || "test"}</h4>
        <a href="/">Bekijk info</a>
    </article>
    <div class="shape2"></div>
</div>

<style>

@layer map-detail-styling{

/* --------------------------------------- Container styling (Gebruikt om ervoor te zorgen dat de content altijd de parent zijn grootte volgt) ------------------------------------ */
    .container {
        width: 100%;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 0);
        display: flex;
        overflow: clip;
    }

/* --------------------------------------- Triangle shape styling (Gebruikt om de driehoeken te vormen en te plaatsen, zit in een layer zodat het werkt voor alleen nieuwere browsers. Stel de layer werkt niet, worden de shapes niet gestyled - ACCESIBLE) ------------------------------------ */

    @layer triangle-shape-styling{
        .shape1, .shape2 {
            transform: translateY(30px);
            width: 100%;
            background-color: var(--color-secondary);
            aspect-ratio: 5.389;
            position: relative;
            @media (min-width: 600px) {
                transform: translateY(30px);
            }
        }
        .shape1 {
            clip-path: shape(from 100% 100%,hline to 0%,line to 26.89% 63.6%,line to 100% 0%,vline to 100%,close);
            right: -4px;
        }
        .shape2 {
            clip-path: shape(from 0% 100%,hline to 100%,line to 73.11% 63.6%,line to 0% 0%,vline to 100%,close);
            left: -4px;
        }
    }

/* --------------------------------------- Info en titel styling ------------------------------------ */

    article {
        border: 4px solid var(--color-secondary);
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: clamp(40vw, 50%, 50vw);
        padding: 1em 2em;
        h4 {
            margin: 0;
            font-size: 1.75em;
            font-weight: bold;
            text-align: center;
            width: 50vw;
        }
        a {
            text-align: center;
            color: var(--link-color);
            text-decoration: none;
            font-size: 1.25em;
        }
    }
}
</style>
