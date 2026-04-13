    <script>
        import { browser } from '$app/environment';

        const { data } = $props();
        const lemma = $derived(data.lemma);

        // Store sanitized body - starts with raw HTML, sanitized on client
        let sanitizedBody = $state('');
        let texts = $state([]);
        let images = $state([]);

        texts = lemma.body.replaceAll(/<[^>]+>/g, ' ').split(/\s{2,}/).filter(Boolean);
        images = lemma.body.match(/<img ([^>]+)>/g).map((img) => img.match(/src="([^"]+)"/)?.[1]) || [];

        console.log(lemma.body);

        console.log(texts);
        console.log('images:')
        console.log(images);

        // Sanitize HTML on the client after hydration
        $effect(() => {
            if (lemma?.body) {
                if (browser) {
                    // Dynamically import DOMPurify only on client
                    import('isomorphic-dompurify')
                        .then((mod) => {
                            sanitizedBody = mod.default.sanitize(lemma.body);
                        })
                        .catch(() => {
                            sanitizedBody = lemma.body;
                        });
                } else {
                    sanitizedBody = lemma.body;
                }
            } else {
                sanitizedBody = '';
            }
        });
    </script>

<svelte:head>
    <title>Wiki - {lemma?.title ?? 'Wiki'}</title>
</svelte:head>

{#if lemma}
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
            <div class="center">
                <div class="halfwidth">
                    <img src="{images[0]}" alt="">
                    {texts[0]}
                    <p>{texts[1]}</p>
                </div>
            </div>
            <div>
                <img src="{images[1]}" alt="" class="halfwidth">
                <p>{texts[2]}</p>
            </div>
            <div>
                <p>{texts[3]} {texts[4]}</p>
                <img src="{images[2]}" alt="" class="halfwidth">
            </div>
            {#each texts.slice(5) as text}
                <p>{text}</p>
            {/each}
        </article>
    </section>
{:else}
    <section>
        <a href="/kaart" class="back-link-kaart">← Terug naar kaart</a>
        <div class="error-message">
            <h1>Lemma niet gevonden</h1>
            <p>
                Het gevraagde lemma kon niet worden geladen. Probeer het later
                opnieuw.
            </p>
        </div>
    </section>
{/if}

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

    img {
        height: auto;
        margin: var(--spacing-wiki-page) 0;
        object-fit: cover;
        width: 100%;
    }
    
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 100%;
    }

    div.center {
        flex-direction: column;
    }
    .halfwidth {
        max-width: 50%;
        flex-direction: column;
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

    .error-message {
        text-align: center;
        padding: var(--spacing-wiki-page);
        h1 {
            color: var(--color-error, #e74c3c);
        }
        p {
            margin-top: 1rem;
            font-size: var(--paragraph-2);
        }
    }
</style>
