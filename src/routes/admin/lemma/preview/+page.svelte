<script>
    import { browser } from '$app/environment';

    /** @type {import('./$types').PageData} */
    const { data } = $props();

    const draft = $derived(data.draft);

    let sanitizedBody = $state('');

    $effect(() => {
        if (draft?.body) {
            if (browser) {
                import('isomorphic-dompurify')
                    .then((mod) => {
                        sanitizedBody = mod.default.sanitize(draft.body);
                    })
                    .catch(() => {
                        sanitizedBody = draft.body;
                    });
            } else {
                sanitizedBody = draft.body;
            }
        } else {
            sanitizedBody = '';
        }
    });
</script>

<svelte:head>
    <title>Admin Preview - {draft?.title || 'Nieuw lemma'}</title>
</svelte:head>

<section class="preview-page">
    <a href="/admin/lemma" class="back-link">← Terug naar lemma beheer</a>

    <p class="preview-label">Alleen zichtbaar voor admin</p>

    <h1>{draft?.title || 'Nieuw lemma (zonder titel)'}</h1>

    {#if draft?.summary}
        <p class="summary">{draft.summary}</p>
    {/if}

    <aside>
        {#if draft?.address}
            <p><strong>Adres:</strong> {draft.address}</p>
        {/if}

        {#if draft?.bouwjaar}
            <p><strong>Bouwjaar:</strong> {draft.bouwjaar}</p>
        {/if}

        {#if draft?.slug}
            <p><strong>Slug:</strong> {draft.slug}</p>
        {/if}
    </aside>

    <article>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html sanitizedBody}
    </article>
</section>

<style>
    .preview-page {
        max-width: 75rem;
        margin: 0 auto;
        padding: clamp(1.5rem, 2.5vw, 3rem);
        text-wrap: balance;
    }

    .back-link {
        display: inline-block;
        margin-bottom: 1rem;
        font-size: var(--paragraph-2);
        color: var(--link-color);
        text-decoration: none;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    .preview-label {
        display: inline-block;
        background-color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        color: white;
        border-radius: 999px;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        margin: 0;
    }

    h1 {
        font-family: var(--main-font-black);
        font-size: calc(var(--heading-2) + 1vw);
        text-transform: uppercase;
        margin: 1rem 0 1.25rem;
    }

    .summary {
        font-size: var(--paragraph-2);
        margin-bottom: 1.25rem;
        color: hsl(var(--secondary-h), var(--secondary-s), 22%);
    }

    aside p {
        margin: 0.4rem 0;
        font-size: var(--paragraph-3);
    }

    article {
        margin-top: 1.5rem;
        position: relative;
        padding-top: 1.5rem;
    }

    article::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: min(80vw, 70rem);
        height: 2px;
        background-color: var(--color-secondary);
    }

    :global(article img) {
        max-width: 100%;
        height: auto;
    }
</style>
