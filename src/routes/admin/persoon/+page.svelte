<script>
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';

    const DIRECTUS_ASSETS = 'https://fdnd-agency.directus.app/assets';

    /** @type {import('./$types').PageData} */
    const { data, form } = $props();

    const persons = $derived(data.persons ?? []);
    const user = $derived(data.user);
    const isAdmin = $derived(user?.role === 2);

    let selectedId = $state(null);
    let selectedPhoto = $state(null);
    let formValues = $state({ name: '', role: '', bio: '' });
    let showSuccess = $state(false);
    let successTimer = null;
    let showDeleteModal = $state(false);

    function triggerSuccess() {
        showSuccess = true;
        clearTimeout(successTimer);
        successTimer = setTimeout(() => {
            showSuccess = false;
        }, 3000);
    }

    function viewPerson(person) {
        selectedId = person.id;
        selectedPhoto = person.picture ?? null;
        formValues.name = person.name ?? '';
        formValues.role = person.role ?? '';
        formValues.bio = person.bio ?? '';
        showDeleteModal = false;
    }

    function newPerson() {
        selectedId = null;
        selectedPhoto = null;
        formValues = { name: '', role: '', bio: '' };
        showDeleteModal = false;
    }

    function photoUrl(photo) {
        if (!photo) return null;
        if (photo.startsWith?.('http')) return photo;
        return `${DIRECTUS_ASSETS}/${photo}`;
    }
</script>

<div class="admin-container">
    <aside class="sidebar">
        <nav>
            <a href="/admin/lemma">Lemma's</a>
            <a href="/admin/persoon" class="active">persoon</a>
            <a href="/admin/comments">comments</a>
        </nav>
    </aside>

    <section class="content">
        <h1>persoon</h1>

        {#if !isAdmin}
            <p class="access-denied">
                Geen toegang. Alleen beheerders kunnen deze pagina bekijken.
            </p>
        {:else}
            <div class="main-content">
                <div class="person-list-container">
                    <div class="person-list-header">
                        <span></span>
                        <span>persoon naam</span>
                        <span>role</span>
                        <button
                            type="button"
                            class="new-btn"
                            onclick={newPerson}
                        >
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
                                    <span class="person-thumb placeholder"
                                    ></span>
                                {/if}
                                <span class="person-name">{person.name}</span>
                                <span class="person-role"
                                    >{person.role ?? ''}</span
                                >
                                <button
                                    type="button"
                                    class="view-btn"
                                    onclick={() => viewPerson(person)}
                                >
                                    bekijk meer
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="form-column">
                    <form
                        class="person-form"
                        method="POST"
                        action="?/upsert"
                        enctype="multipart/form-data"
                        use:enhance={() =>
                            async ({ result, update }) => {
                                await update({ reset: false });
                                if (
                                    result.type === 'success' ||
                                    result.data?.success
                                ) {
                                    await invalidateAll();
                                    triggerSuccess();
                                }
                            }}
                    >
                        {#if form?.error}
                            <p class="form-error">{form.error}</p>
                        {/if}
                        {#if showSuccess}
                            <p class="form-success">Opgeslagen!</p>
                        {/if}

                        <!-- Hidden id field: present when editing, absent when creating -->
                        {#if selectedId}
                            <input type="hidden" name="id" value={selectedId} />
                        {/if}

                        <div class="form-group">
                            <label for="name">name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                bind:value={formValues.name}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="role">functie/role</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                bind:value={formValues.role}
                            />
                        </div>

                        <div class="form-group">
                            <label for="bio">bio beschrijving</label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows="6"
                                bind:value={formValues.bio}
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label for="photo">foto</label>
                            {#if selectedPhoto}
                                <div class="photo-preview">
                                    <img
                                        src={photoUrl(selectedPhoto)}
                                        alt="huidige foto"
                                    />
                                </div>
                            {/if}
                            <label class="upload-btn">
                                {selectedPhoto
                                    ? 'foto vervangen'
                                    : 'upload foto'}
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    class="sr-only"
                                />
                            </label>
                        </div>

                        <div class="form-actions">
                            {#if selectedId}
                                <button
                                    type="button"
                                    class="delete-btn"
                                    onclick={() => (showDeleteModal = true)}
                                >
                                    verwijder persoon
                                </button>
                            {/if}
                            <button type="submit" class="confirm-btn">
                                {selectedId ? 'opslaan' : 'aanmaken'}
                            </button>
                        </div>
                    </form>

                    {#if showDeleteModal}
                        <div
                            class="modal-overlay"
                            role="dialog"
                            aria-modal="true"
                            tabindex="-1"
                            onclick={(e) => {
                                if (e.target === e.currentTarget)
                                    showDeleteModal = false;
                            }}
                            onkeydown={(e) => {
                                if (e.key === 'Escape') showDeleteModal = false;
                            }}
                        >
                            <div class="modal">
                                <p class="modal-message">
                                    Weet je zeker dat je <strong
                                        >{formValues.name}</strong
                                    > wilt verwijderen?
                                </p>
                                <div class="modal-actions">
                                    <form
                                        method="POST"
                                        action="?/delete"
                                        use:enhance={() =>
                                            async ({ result, update }) => {
                                                await update({ reset: false });
                                                if (
                                                    result.type === 'success' ||
                                                    result.data?.deleted
                                                ) {
                                                    selectedId = null;
                                                    selectedPhoto = null;
                                                    formValues = {
                                                        name: '',
                                                        role: '',
                                                        bio: '',
                                                    };
                                                    showDeleteModal = false;
                                                    await invalidateAll();
                                                }
                                            }}
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={selectedId}
                                        />
                                        <button
                                            type="submit"
                                            class="modal-confirm-btn"
                                            >Ja, verwijder</button
                                        >
                                    </form>
                                    <button
                                        type="button"
                                        class="modal-cancel-btn"
                                        onclick={() =>
                                            (showDeleteModal = false)}
                                        >Annuleren</button
                                    >
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </section>
</div>

<style>
    .admin-container {
        display: grid;
        grid-template-columns: 200px 1fr;
        min-height: calc(100vh - var(--header-height, 10vh));
    }

    /* Sidebar */
    .sidebar {
        grid-column: 1;
        grid-row: 1;
        position: relative;
        background-color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        padding: 3rem 1.5rem;
        padding-top: 5rem;
        margin-top: 4rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    /* Sloped top - only on the sidebar, higher on left lower on right */
    .sidebar::before {
        content: '';
        position: absolute;
        top: -30px;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        clip-path: polygon(0 0, 0 100%, 100% 100%);
    }

    .sidebar nav {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
    }

    .sidebar a {
        color: hsl(var(--primary-h), var(--primary-s), 68%);
        text-decoration: none;
        font-size: var(--paragraph-size, 1.25rem);
        transition: color 0.2s ease;
    }

    .sidebar a:hover,
    .sidebar a.active {
        text-decoration: underline;
        color: hsl(var(--primary-h), var(--primary-s), 80%);
    }

    /* Content */
    .content {
        grid-column: 2;
        grid-row: 1;
        padding: 2rem;
        background-color: var(--color-neutral);
        overflow-x: auto;
    }

    h1 {
        font-size: var(--heading-2, 2.5rem);
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        margin-bottom: 1.5rem;
        text-decoration: underline;
    }

    .main-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 4px;
        padding: 1rem;
        background-color: hsl(var(--primary-h), var(--primary-s), 90%);
    }

    /* Person List */
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

    .person-name {
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
    }

    .person-role {
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
    }

    .view-btn {
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

    .view-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 35%);
    }

    /* Form action row */
    .form-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 1.5rem;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    /* Delete button */
    .delete-btn {
        background-color: transparent;
        border: 1px solid hsl(0, 60%, 45%);
        color: hsl(0, 60%, 40%);
        padding: 0.35rem 0.75rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.8rem;
        transition:
            background-color 0.2s ease,
            color 0.2s ease;
    }

    .delete-btn:hover {
        background-color: hsl(0, 60%, 45%);
        color: white;
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background-color: hsl(var(--primary-h), var(--primary-s), 95%);
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 6px;
        padding: 1.5rem 2rem;
        max-width: 380px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    }

    .modal-message {
        font-size: 1rem;
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        margin-bottom: 1.25rem;
        line-height: 1.5;
    }

    .modal-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    .modal-confirm-btn {
        background-color: hsl(0, 60%, 45%);
        color: white;
        border: none;
        padding: 0.4rem 1rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
    }

    .modal-confirm-btn:hover {
        background-color: hsl(0, 60%, 35%);
    }

    .modal-cancel-btn {
        background-color: transparent;
        border: 1px solid hsl(var(--secondary-h), var(--secondary-s), 40%);
        color: hsl(var(--secondary-h), var(--secondary-s), 25%);
        padding: 0.4rem 1rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
    }

    .modal-cancel-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 80%);
    }

    /* Form */
    .person-form {
        background-color: hsl(var(--primary-h), var(--primary-s), 68%);
        border-radius: 4px;
        padding: 1rem;
    }

    .form-group {
        margin-bottom: 0.65rem;
    }

    .form-group label {
        display: block;

        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }

    .form-group input[type='text'],
    .form-group textarea {
        width: 100%;
        padding: 0.4rem;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 2px;
        background-color: hsl(var(--primary-h), var(--primary-s), 85%);
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-family: var(--main-font);
        font-size: 1rem;
        box-sizing: border-box;
    }

    .form-group textarea {
        resize: vertical;
        min-height: 120px;
        line-height: 1.6;
        font-size: 0.95rem;
    }

    .upload-btn {
        display: inline-block;
        background-color: hsl(var(--secondary-h), var(--secondary-s), 25%);
        color: white;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        padding: 0.35rem 0.75rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background-color 0.2s ease;
    }

    .upload-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 35%);
        color: white;
    }

    .confirm-btn {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 25%);
        color: white;
        border: none;
        padding: 0.4rem 1.25rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
    }

    .confirm-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 35%);
    }

    /* Responsive */
    @media (max-width: 900px) {
        .main-content {
            grid-template-columns: 1fr;
        }
    }

    /* Access denied */
    .access-denied {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
    }

    /* Form feedback */
    .form-error {
        background-color: hsl(0, 70%, 90%);
        color: hsl(0, 70%, 30%);
        border: 1px solid hsl(0, 70%, 70%);
        padding: 0.4rem 0.75rem;
        border-radius: 2px;
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
    }

    .form-success {
        background-color: hsl(120, 50%, 88%);
        color: hsl(120, 50%, 25%);
        border: 1px solid hsl(120, 50%, 65%);
        padding: 0.4rem 0.75rem;
        border-radius: 2px;
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
        animation: success-fade 3s ease forwards;
    }

    @keyframes success-fade {
        0% {
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    /* Person thumbnail */
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

    /* Selected row highlight */
    .person-list li.selected {
        background-color: hsl(var(--primary-h), var(--primary-s), 85%);
        outline: 2px solid hsl(var(--secondary-h), var(--secondary-s), 25%);
    }

    /* Photo preview in form */
    .photo-preview {
        margin-bottom: 0.5rem;
        border-radius: 4px;
        overflow: hidden;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        width: 100%;
        max-height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: hsl(var(--secondary-h), var(--secondary-s), 10%);
    }

    .photo-preview img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        display: block;
    }

    /* Sidebar layout needs to stretch full height for logout placement */
    /* (Already handled by space-between on the main .sidebar rule above) */

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
        width: fit-content;
    }

    .new-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 35%);
    }

    @media (max-width: 600px) {
        .admin-container {
            display: flex;
            flex-direction: column;
        }

        .sidebar {
            padding: 1rem;
        }

        .sidebar::before {
            display: none;
        }

        .sidebar nav {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
        }

        .content {
            padding: 1rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        .main-content {
            grid-template-columns: 1fr;
        }

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
