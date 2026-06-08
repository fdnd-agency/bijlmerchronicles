<script>
    const { data } = $props();
    const lemma = $derived(data.lemma);

    // alle lemma's
    const allLemmas = $derived(data.allLemmas ?? []);
    // alle personen
    const allPeople = $derived(data.allPeople ?? []);

    // De body uit Directus is al nette HTML (paragrafen, koppen, lijsten,
    // afbeeldingen). We renderen die structuur direct, zodat elk lemma
    // dezelfde leesbare opmaak krijgt. We voegen interne links toe en geven
    // elke afbeelding een wisselende positie (midden, rechts, links, ...).
    const bodyHtml = $derived(
        lemma?.body
            ? positionImages(linkifyHtml(lemma.body, allLemmas, allPeople))
            : '',
    );

    // Geeft elke afbeelding op volgorde een positieklasse:
    // 1e in het midden, 2e zweeft rechts, 3e zweeft links, 4e weer midden, ...
    function positionImages(html) {
        const positions = ['img-center', 'img-right', 'img-left'];
        let index = 0;

        return html.replace(/<img\b[^>]*>/gi, (tag) => {
            const cls = positions[index % positions.length];
            index++;

            if (/\sclass\s*=\s*"/i.test(tag)) {
                return tag.replace(/class\s*=\s*"([^"]*)"/i, `class="$1 ${cls}"`);
            }

            return tag.replace(/<img/i, `<img class="${cls}"`);
        });
    }

    // Splits een titel/naam op &, komma's en " en " in losse varianten,
    // zodat samengestelde titels ook los gelinkt kunnen worden.
    function expandVariants(value) {
        const variants = [value];

        if (value.includes('&') || value.includes(',') || value.includes(' en ')) {
            const parts = value
                .split(/&|,| en /)
                .map((t) => t.trim())
                .filter(Boolean);

            variants.push(...parts);
        }

        return variants;
    }

    // Vervangt voorkomende titels/namen in een stuk platte tekst door links.
    // In één pass via een alternatie, langste varianten eerst, zodat er geen
    // geneste links ontstaan.
    function applyLinks(text, targets) {
        if (!text.trim() || targets.length === 0) return text;

        const re = new RegExp(`\\b(${targets.map((t) => t.escaped).join('|')})\\b`, 'gi');

        return text.replace(re, (match) => {
            const target = targets.find(
                (t) => t.text.toLowerCase() === match.toLowerCase(),
            );

            if (!target) return match;

            return `<a href="${target.href}" class="${target.cls}">${match}</a>`;
        });
    }

    // Loopt door de HTML en linkt alleen tekst buiten tags. Tekst die al
    // binnen een <a> staat wordt overgeslagen, zodat er geen geneste links
    // ontstaan en attribuutwaarden niet kapot worden gemaakt.
    function linkifyHtml(html, lemmas, people) {
        const targets = [];

        for (const l of lemmas) {
            const title = l.title?.trim();
            if (!title) continue;
            if (lemma?.title && title.toLowerCase() === lemma.title.toLowerCase()) continue;

            for (const variant of expandVariants(title)) {
                targets.push({ text: variant, href: `/wiki/${l.slug}`, cls: 'wiki-link' });
            }
        }

        for (const p of people) {
            const name = p.name?.trim();
            if (!name) continue;

            for (const variant of expandVariants(name)) {
                targets.push({ text: variant, href: `/team/${p.id}`, cls: 'person-link' });
            }
        }

        // Ontdubbel en sorteer langste eerst (alternatie kiest eerste match).
        const seen = new Set();
        const uniqueTargets = [];
        for (const t of targets.sort((a, b) => b.text.length - a.text.length)) {
            const key = t.text.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            uniqueTargets.push({
                ...t,
                escaped: t.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            });
        }

        let result = '';
        let lastIndex = 0;
        let anchorDepth = 0;
        const tagRe = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
        let match;

        while ((match = tagRe.exec(html))) {
            const chunk = html.slice(lastIndex, match.index);
            result += anchorDepth > 0 ? chunk : applyLinks(chunk, uniqueTargets);

            const tagName = match[1].toLowerCase();
            if (tagName === 'a') {
                if (match[0].startsWith('</')) {
                    anchorDepth = Math.max(0, anchorDepth - 1);
                } else if (!match[0].endsWith('/>')) {
                    anchorDepth++;
                }
            }

            result += match[0];
            lastIndex = tagRe.lastIndex;
        }

        const tail = html.slice(lastIndex);
        result += anchorDepth > 0 ? tail : applyLinks(tail, uniqueTargets);

        return result;
    }
</script>

<svelte:head>
    <title>Wiki - {lemma?.title ?? 'Wiki'}</title>
</svelte:head>

{#if lemma}
    <section>
        <a href="/kaart" class="back-link-kaart">← Terug naar kaart</a>

        <h1>{lemma.title}</h1>

        {#if lemma.address || lemma.bouwjaar}
            <aside>
                {#if lemma.address}
                    <p><strong>Adres:</strong> {lemma.address}</p>
                {/if}

                {#if lemma.bouwjaar}
                    <p><strong>Bouwjaar:</strong> {lemma.bouwjaar}</p>
                {/if}
            </aside>
        {/if}

        <!-- WIKI INHOUD (body) -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <article>{@html bodyHtml}</article>
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
        position: relative;
    }

    .back-link-kaart {
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

    aside {
        margin: 0;
        p {
            margin: 0.25rem 0;
            font-size: var(--paragraph-3);
        }
    }

    article {
        margin-top: var(--spacing-wiki-page);
        padding-top: var(--spacing-wiki-page);
        position: relative;
        text-align: left;
        text-wrap: pretty;
        /* float-afbeeldingen netjes binnen het artikel houden */
        &::after {
            content: '';
            display: block;
            clear: both;
        }
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            max-width: 70rem;
            background-color: var(--color-secondary);
            height: 2px;
        }
    }

    /* De body-HTML komt uit Directus, dus styling via :global(). */
    article :global(p),
    article :global(.ds-markdown-paragraph) {
        margin: 0 0 1.25em;
        line-height: 1.6;
        font-size: var(--paragraph-3);
    }

    article :global(h2),
    article :global(h3) {
        font-family: var(--main-font-black, inherit);
        line-height: 1.3;
        margin: 1.75em 0 0.5em;
        clear: both;
    }

    article :global(h2) {
        font-size: var(--heading-3, 1.5rem);
    }

    article :global(h3) {
        font-size: var(--heading-4, 1.25rem);
    }

    article :global(ul),
    article :global(ol) {
        margin: 0 0 1.25em;
        padding-left: 1.5em;
        line-height: 1.6;
        font-size: var(--paragraph-3);
    }

    article :global(li) {
        margin-bottom: 0.4em;
    }

    article :global(blockquote) {
        margin: 1.5em 0;
        padding: 0.5em 1.25em;
        border-left: 4px solid var(--color-secondary);
        font-style: italic;
    }

    article :global(a) {
        color: var(--link-color);
        text-decoration: underline;
    }

    /* Afbeeldingen staan inline in de body; lemma's zonder afbeelding
       tonen simpelweg geen img. Elke afbeelding krijgt op volgorde een
       wisselende positie: midden -> rechts -> links -> midden -> ... */
    article :global(img) {
        height: auto;
        object-fit: cover;
        border-radius: 20px;
    }

    /* 1e, 4e, 7e ... : gecentreerd blok */
    article :global(img.img-center) {
        display: block;
        width: 100%;
        max-width: 45rem;
        margin: 1.5em auto;
    }

    /* 2e, 5e, 8e ... : zweeft rechts, tekst loopt er links omheen */
    article :global(img.img-right) {
        float: right;
        width: 45%;
        margin: 0.5em 0 1em 1.75em;
    }

    /* 3e, 6e, 9e ... : zweeft links, tekst loopt er rechts omheen */
    article :global(img.img-left) {
        float: left;
        width: 45%;
        margin: 0.5em 1.75em 1em 0;
    }

    /* Op smalle schermen stapelen alle afbeeldingen netjes onder elkaar. */
    @media (max-width: 40rem) {
        article :global(img.img-center),
        article :global(img.img-right),
        article :global(img.img-left) {
            float: none;
            display: block;
            width: 100%;
            margin: 1.5em auto;
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
