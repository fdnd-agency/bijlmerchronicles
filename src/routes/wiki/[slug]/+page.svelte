<script>
    const { data } = $props();
    const lemma = $derived(data.lemma);

    // alle lemma's
    const allLemmas = $derived(data.allLemmas ?? []);
    // alle personen
    const allPeople = $derived(data.allPeople ?? []);

    let texts = $state([]);
    let images = $state([]);

    // svelte-ignore state_referenced_locally
    let matches = lemma.body.match(/<img ([^>]+)>/g) ?? false;

    images = matches
        ? matches.map((img) => img.match(/src="([^"]+)"/)?.[1])
        : [];

    function decodeHtmlEntities(str) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    }

    function linkify(text, lemmas, allPeople) {
        let result = text;

        // === LEMMAS ===
        for (const l of lemmas) {
            let title = l.title?.trim();

            if (!title) continue;
            if (title.toLowerCase() === lemma.title.toLowerCase()) continue;

            const variants = [title];

            // split op &, en en ,
            if (title.includes('&') || title.includes(',') || title.includes(' en ')) {
                const splitTitles = title
                    .split(/&|en|,/)
                    .map((t) => t.trim())
                    .filter(Boolean);

                variants.push(...splitTitles);
            }

            for (const variant of variants) {
                const escaped = variant.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&',
                );

                const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');

                result = result.replace(
                    regex,
                    `<a href="/wiki/${l.slug}" class="wiki-link">$1</a>`,
                );
            }
        }

        // === PEOPLE ===
        for (const p of allPeople) {
            let name = p.name?.trim();

            if (!name) continue;

            const variants = [name];

            // split op &, en en ,
            if (name.includes('&') || name.includes(',') || name.includes(' en ')) {
                const splitNames = name
                    .split(/&|en|,/)
                    .map((t) => t.trim())
                    .filter(Boolean);

                variants.push(...splitNames);
            }

            for (const variant of variants) {
                const escaped = variant.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&',
                );

                const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');

                result = result.replace(
                    regex,
                    `<a href="/team/${p.id}" class="person-link">$1</a>`,
                );
            }
        }

        return result;
    }

    $effect(() => {
        if (!lemma?.body) return;

        texts = decodeHtmlEntities(lemma.body)
            .replaceAll(/<[^>]+>/g, ' ')
            .split(/\s{2,}/)
            .filter(Boolean)
            .map((text) => linkify(text, allLemmas, allPeople));

        let matches = lemma.body.match(/<img ([^>]+)>/g) ?? false;

        images = matches
            ? matches.map((img) => img.match(/src="([^"]+)"/)?.[1])
            : [];
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
                    <img src={images[0] ?? ''} alt="" />
                    <p>{@html texts[0]}</p>
                    <p>{@html texts[1]}</p>
                </div>
            </div>
            <div>
                <img src={images[1] ?? ''} alt="" class="halfwidth" />
                <p>{@html texts[2]}</p>
            </div>
            <div>
                <p>{@html texts[3]} {@html texts[4]}</p>
                <img src={images[2] ?? ''} alt="" class="halfwidth" />
            </div>
            {#each texts.slice(5) as text}
                <p>{@html text}</p>
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
        object-fit: cover;
        width: 100%;
        margin: 10px;
        border-radius: 20px;
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
