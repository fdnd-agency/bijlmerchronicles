<script>
    let {
        lemmas = [],
        selectedId = null,
        onView = () => {},
        onNew = () => {},
    } = $props();
</script>

<div class="lemma-list-container">
    <div class="lemma-list-header">
        <span>lemma titel</span>
        <button type="button" class="new-btn" onclick={onNew}>
            nieuw lemma
        </button>
    </div>

    <ul class="lemma-list">
        {#each lemmas as lemma (lemma.id)}
            <li class:selected={selectedId === lemma.id}>
                <span class="lemma-title">{lemma.title}</span>

                <div class="lemma-actions">
                    <button
                        type="button"
                        class="view-btn"
                        onclick={() => onView(lemma)}
                    >
                        bekijk meer
                    </button>
                </div>
            </li>
        {/each}
    </ul>
</div>

<style>
    .lemma-list-container {
        background-color: hsl(var(--primary-h), var(--primary-s), 68%);
        border-radius: 4px;
        padding: 0.75rem;
        max-height: 70vh;
        overflow-y: auto;
    }

    .lemma-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 0.5rem;
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .lemma-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .lemma-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.4rem 0.5rem;
        background-color: hsl(var(--primary-h), var(--primary-s), 75%);
        border-radius: 2px;
    }

    .lemma-list li.selected {
        background-color: hsl(var(--primary-h), var(--primary-s), 85%);
        outline: 2px solid hsl(var(--secondary-h), var(--secondary-s), 25%);
    }

    .lemma-title {
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
    }

    .lemma-actions {
        display: flex;
        gap: 0.35rem;
        align-items: center;
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
</style>
