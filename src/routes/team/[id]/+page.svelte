<script>
    let { data } = $props();
    const defaultImage = '/images/default.png';
    
    
    // alle lemma's
    const allLemmas = $derived(data.allLemmas ?? []);
    // alle personen
    const allPeople = $derived(data.allPeople ?? []);

    console.log('All Lemmas:', allLemmas);
    console.log('All People:', allPeople);

    let texts = $state([]);
    
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
            if (name.toLowerCase() === data.member.name.toLowerCase()) continue;

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
        if (!data.member.bio) return;

        texts = decodeHtmlEntities(data.member.bio)
            .replaceAll(/<[^>]+>/g, ' ')
            .split(/\s{2,}/)
            .filter(Boolean)
            .map((text) => linkify(text, data.allLemmas, data.allPeople));
    });
</script>

{#if data && data.member}
    <main class="member-grid">
        <h1>{data.member.name}</h1>

        <picture class="profile-picture">
            <source
                srcset={data.member.picture
                    ? `https://fdnd-agency.directus.app/assets/${data.member.picture}?format=avif`
                    : defaultImage}
                type="image/avif"
            />
            <source
                srcset={data.member.picture
                    ? `https://fdnd-agency.directus.app/assets/${data.member.picture}?format=webp`
                    : defaultImage}
                type="image/webp"
            />
            <img
                src={data.member.picture
                    ? `https://fdnd-agency.directus.app/assets/${data.member.picture}`
                    : defaultImage}
                alt={data.member.name}
            />
        </picture>

        <p class="role">{data.member.role || 'Functie'}</p>

        <div class="bio">
            {#each texts as text}
                <p>{@html text}</p>
            {/each}
        </div>
    </main>
{:else}
    <p>Laden of teamlid niet gevonden...</p>
{/if}

<style>
    .member-grid {
        display: grid;
        grid-template-columns: 1fr;
        padding: 2rem 1.5rem;
        gap: 0.5rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        font-size: var(--heading-1);
        font-family: var(--main-font-black);
        text-transform: uppercase;
        color: var(--color-secondary);
        margin: 0;
    }

    .profile-picture {
        background-color: var(--color-primary-light);
        margin: 1rem 0;
        border: 3px solid var(--color-secondary);

        img {
            width: 100%;
            height: auto;
            display: block;
        }
    }

    .role {
        font-size: var(--paragraph-size);
        text-transform: uppercase;
        color: var(--color-secondary);
        margin: 0;
    }

    .bio {
        font-size: var(--paragraph-2);
        line-height: 1.6;
        margin: 0;
        white-space: pre-line;
    }

    @media (min-width: 768px) {
        .member-grid {
            grid-template-columns: 1fr 1.5fr;
            grid-template-areas:
                'photo name'
                'photo role'
                'photo bio';
            gap: 1rem 4rem;
            align-items: start;
            padding: 4rem 2rem;
        }

        .profile-picture {
            grid-area: photo;
            margin: 0;
            border: 3px solid var(--color-secondary);
            aspect-ratio: 3 / 4;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

        h1 {
            font-size: var(--heading-1);
            align-self: end;
        }

        .role {
            font-size: var(--heading-3);
        }
    }
</style>
