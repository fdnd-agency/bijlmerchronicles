<script>
    const lemma = {
        title: "Johan Cruijff ArenA",
    }
</script>

<!-- PARENT RELATIEF MAKEN -->
<div class="container">
    <div id="shape" class="shape"></div>
    <article>
        <h4>{lemma.title || "test"}</h4>
        <a href="/">Bekijk info</a>
    </article>
    <div id="shape" class="shape2"></div>
</div>

<style>
    .container {
        width: 100%;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 0);
        display: flex;
        overflow: clip;
    }
    #shape {
        transform: translateY(20px);
        width: 100%;
        background-color: #263B1C;
        aspect-ratio: 5.389;
    }
    .shape {
        clip-path: shape(from 100% 100%,hline to 0%,line to 26.89% 63.6%,line to 100% 0%,vline to 100%,close);
    }
    .shape2 {
        clip-path: shape(from 0% 100%,hline to 100%,line to 73.11% 63.6%,line to 0% 0%,vline to 100%,close);
    }
    article {
        border: 4px solid #263B1C;
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
        }
        a {
            text-align: center;
            color: #3478FF;
            text-decoration: none;
            font-size: 1.25em;
        }
    }
</style>
