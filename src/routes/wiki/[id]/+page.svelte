<script>
    export let data;

    const { lemma } = data;
</script>

<svelte:head>
    <title>{lemma.title} - Wiki</title>
</svelte:head>

<a href="/kaart" class="back-link">← Terug naar kaart</a>

<section class="lemma-info-container">

    <h1>{lemma.title}</h1>

    {#if lemma.address}
        <p><strong>Adres:</strong> {lemma.address}</p>
    {/if}

    {#if lemma.bouwjaar}
        <p><strong>Bouwjaar:</strong> {lemma.bouwjaar}</p>
    {/if}

    <!-- WIKI INHOUD (body) -->
    <article class="article-body">
        {@html lemma.body}
    </article>

</section>