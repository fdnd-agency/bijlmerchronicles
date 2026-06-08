<script>
    import { SearchIcon } from '$lib';

    export let type = 'Searchbar';

    const DIRECTUS = 'https://fdnd-agency.directus.app';
    const DEFAULT_IMAGE = '/images/default.png';
    const DEBOUNCE_MS = 200;
    const RESULT_LIMIT = 8;

    let query = '';
    let lemmas = [];
    let persons = [];
    let open = false;
    let loading = false;
    let containerEl;
    let debounceId;
    let activeRequest = 0;

    $: search(query);
    $: hasResults = lemmas.length + persons.length > 0;
    $: showDropdown = open && query.trim().length > 0;
    $: statusMessage = hasResults
        ? ''
        : loading
            ? 'Zoeken…'
            : `Geen resultaten voor "${query}".`;

    function search(value) {
        clearTimeout(debounceId);
        const term = value.trim();

        if (!term) {
            lemmas = [];
            persons = [];
            open = false;
            loading = false;
            return;
        }

        loading = true;
        open = true;
        debounceId = setTimeout(() => fetchResults(term), DEBOUNCE_MS);
    }

    async function fetchResults(term) {
        const requestId = ++activeRequest;
        const q = encodeURIComponent(term);

        const [foundLemmas, foundPersons] = await Promise.all([
            fetchItems(
                `/items/emibazo_lemma?fields=id,slug,title&filter[title][_icontains]=${q}&limit=${RESULT_LIMIT}`,
            ),
            fetchItems(
                `/items/emibazo_persoon?fields=id,name,role,picture&filter[name][_icontains]=${q}&limit=${RESULT_LIMIT}`,
            ),
        ]);

        if (requestId !== activeRequest) return;

        lemmas = foundLemmas;
        persons = foundPersons;
        loading = false;
    }

    async function fetchItems(path) {
        try {
            const res = await fetch(`${DIRECTUS}${path}`);
            if (!res.ok) return [];
            const json = await res.json();
            return json.data ?? [];
        } catch {
            return [];
        }
    }

    function personImage(person) {
        return person.picture
            ? `${DIRECTUS}/assets/${person.picture}?width=80`
            : DEFAULT_IMAGE;
    }

    function closeOnOutsideClick(event) {
        if (containerEl && !containerEl.contains(event.target)) open = false;
    }
</script>

<svelte:window
    on:click={closeOnOutsideClick}
    on:keydown={(e) => e.key === 'Escape' && (open = false)}
/>

<div class="searchbar-wrapper" bind:this={containerEl}>
    <form
        method="get"
        class="searchbar-container"
        on:submit|preventDefault
        role="search"
    >
        <input
            class="search-input"
            type="text"
            name="query"
            bind:value={query}
            on:focus={() => query.trim() && (open = true)}
            placeholder="Waar ligt de Johan Cruijff ArenA?"
            aria-label={type}
            aria-autocomplete="list"
            autocomplete="off"
        />

        <button type="submit" class="search-button" aria-label="Zoeken">
            <SearchIcon />
        </button>
    </form>

    {#snippet group(title, items, renderItem)}
        {#if items.length > 0}
            <h4>{title}</h4>
            <ul>
                {#each items as item (item.id)}
                    <li>{@render renderItem(item)}</li>
                {/each}
            </ul>
        {/if}
    {/snippet}

    {#snippet lemmaItem(lemma)}
        <a href="/wiki/{lemma.slug}">{lemma.title}</a>
    {/snippet}

    {#snippet personItem(person)}
        <a href="/team/{person.id}" class="person-row">
            <img src={personImage(person)} alt="" />
            <span>
                <strong>{person.name}</strong>
                {#if person.role}<em>{person.role}</em>{/if}
            </span>
        </a>
    {/snippet}

    {#if showDropdown}
        <div class="results">
            {#if statusMessage}<p class="status">{statusMessage}</p>{/if}
            {@render group("Lemma's", lemmas, lemmaItem)}
            {@render group('Personen', persons, personItem)}
        </div>
    {/if}
</div>

<style>
    :root {
        --button-width: 4.375rem;
        --button-height: 3.125rem;
    }

    .searchbar-wrapper {
        position: relative;
        max-width: 37.5rem;
        width: 100%;
    }

    .searchbar-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .search-input {
        width: 100%;
        padding: 0.7rem;
        font-size: 1.5rem;
        border: 0.3rem solid var(--color-secondary);
        flex: 1;
        border-radius: 0.6rem;
        background-color: var(--color-neutral-200);
        color: var(--color-secondary);
        &:focus {
            outline: 2px solid var(--color-secondary);
            outline-offset: 0.2rem;
            box-shadow: none;
        }
    }

    .search-input::placeholder {
        color: var(--color-secondary);
        opacity: 0.7;
        text-align: center;
    }

    .search-button {
        background-color: var(--color-secondary);
        width: var(--button-width);
        height: var(--button-height);
        position: relative;
        padding: 1.7rem 1.1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0.3rem 0.3rem 0.1rem 0.06rem var(--color-neutral-200);
        &:focus {
            outline: 0.1rem solid var(--color-secondary);
            outline-offset: 0.2rem;
            box-shadow: none;
        }
    }

    .results {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: calc(var(--button-width) + 1rem);
        max-height: 70vh;
        overflow-y: auto;
        background-color: var(--color-neutral);
        border: 0.2rem solid var(--color-secondary);
        border-radius: 0.6rem;
        padding: 0.5rem 0;
        z-index: 50;
        box-shadow: 0.3rem 0.3rem 0.1rem 0.06rem var(--color-secondary);
    }

    .results h4 {
        margin: 0.5rem 1rem 0.25rem 1rem;
        font-family: var(--main-font-black);
        color: var(--color-secondary);
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .results ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .results a {
        display: block;
        padding: 0.6rem 1rem;
        color: var(--color-secondary);
        text-decoration: none;
        font-size: 1.1rem;
    }

    .results a:hover,
    .results a:focus {
        background-color: var(--color-tertiary);
        color: var(--color-secondary);
        outline: none;
    }

    .person-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .person-row img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .person-row span {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
    }

    .person-row em {
        font-style: normal;
        opacity: 0.75;
        font-size: 0.85em;
    }

    .status {
        margin: 0.5rem 1rem;
        color: var(--color-secondary);
        font-size: 1rem;
    }
</style>
