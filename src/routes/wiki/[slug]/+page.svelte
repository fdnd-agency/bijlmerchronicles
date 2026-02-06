<script>
    export let data;

    const { lemma } = data;
</script>

<svelte:head>
    <title>Wiki - {lemma.title}</title>
</svelte:head>

<section>
    <a href="/kaart" class="back-link-kaart">← Terug naar kaart</a>

    <h1>{lemma.title}</h1>

    <aside>
        {#if lemma.address}
            <p><strong>Adres:</strong> {lemma.address}</p>
        {/if}

        {#if lemma.bouwjaar}
            <p><strong>Bouwjaar:</strong> {lemma.bouwjaar}</p>
        {/if}
    </aside>

    <!-- WIKI INHOUD (body) -->
    <article>
        {@html lemma.body}
    </article>
</section>

<style>
    :root {
        --spacing-wiki-page: clamp(1.5rem, 2.5vw, 3rem);
    }

    section {
        max-width: 75rem;
        margin: 0 auto;
        padding: var(--spacing-wiki-page);
        text-wrap: balance;
        position: relative;
    }

    a {
        width: 100%;
        text-align: center;
        display: inline-block;
        text-decoration: none;
        font-size: var(--paragraph-2);
        color: var(--link-color);
        &:hover {
            text-decoration: underline;
        }
    }

    h1 {
        font-family: var(--main-font-black);
        font-size: calc(var(--heading-2) + 1vw);
        text-transform: uppercase;
        text-align: center;
        margin: var(--spacing-wiki-page) 0;
    }

    p,
    :global(.ds-markdown-paragraph) {
        margin: calc(var(--spacing-wiki-page) + -0.6vw) 0;
        line-height: 1.5;
        text-wrap: pretty;
    }

    p {
        font-size: var(--paragraph-3);
    }

    :global(.ds-markdown-paragraph) {
        font-size: var(--paragraph-size);
        max-width: 80ch;
        :global(img) {
            width: 100%;
            height: auto;
            margin: 0;
        }
    }

    article {
        margin-top: var(--spacing-wiki-page);
        position: relative;
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            max-width: 70rem;
            width: 80vw;
            background-color: var(--color-secondary);
            height: 2px;
        }
    }
</style>
