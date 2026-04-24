<script>
    let {
        persons = [],
        selectedId = null,
        onView = () => {},
        onNew = () => {},
        photoUrl = () => null,
    } = $props();
</script>

<div class="person-list-container">
    <div class="person-list-header">
        <span></span>
        <span>persoon naam</span>
        <span>role</span>
        <button type="button" class="new-btn" onclick={onNew}>
            nieuw persoon
        </button>
    </div>

    <ul class="person-list">
        {#each persons as person (person.id)}
            <li class:selected={selectedId === person.id}>
                {#if person.picture}
                    <img
                        src={photoUrl(person.picture)}
                        alt={person.name}
                        class="person-thumb"
                    />
                {:else}
                    <span class="person-thumb placeholder"></span>
                {/if}

                <span class="person-name">{person.name}</span>
                <span class="person-role">{person.role ?? ''}</span>

                <button
                    type="button"
                    class="view-btn"
                    onclick={() => onView(person)}
                >
                    bekijk meer
                </button>
            </li>
        {/each}
    </ul>
</div>

<style>
    .person-list-container {
        background-color: hsl(var(--primary-h), var(--primary-s), 68%);
        border-radius: 4px;
        padding: 0.75rem;
    }

    .person-list-header {
        display: grid;
        grid-template-columns: 36px 1fr 100px 80px;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .person-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .person-list li {
        display: grid;
        grid-template-columns: 36px 1fr 100px 80px;
        gap: 0.5rem;
        align-items: center;
        padding: 0.4rem 0.5rem;
        background-color: hsl(var(--primary-h), var(--primary-s), 75%);
        border-radius: 2px;
    }

    .person-list li.selected {
        background-color: hsl(var(--primary-h), var(--primary-s), 85%);
        outline: 2px solid hsl(var(--secondary-h), var(--secondary-s), 25%);
    }

    .person-name,
    .person-role {
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
    }

    .person-thumb {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .person-thumb.placeholder {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 40%);
        display: inline-block;
    }

    .view-btn,
    .new-btn {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 25%);
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.75rem;
        transition: background-color 0.2s ease;
        white-space: nowrap;
    }

    .new-btn {
        width: fit-content;
    }

    .view-btn:hover,
    .new-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 35%);
    }

    @media (max-width: 600px) {
        .person-list-header,
        .person-list li {
            grid-template-columns: 36px 1fr auto;
        }

        .person-list-header span:nth-child(3),
        .person-role {
            display: none;
        }
    }
</style>
