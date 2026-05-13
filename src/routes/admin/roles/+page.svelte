<script>
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import AdminSidebar from '$lib/components/molecules/AdminSidebar.svelte';

    /** @type {import('./$types').PageData} */
    const { data, form } = $props();

    const users = $derived(data.users ?? []);
    const user = $derived(data.user);
    const isAdmin = $derived(user?.role === 2);

    // Role IDs in the backend: 1 = user, 2 = admin, 3 = moderator
    const ROLE_LABELS = {
        1: 'user',
        2: 'admin',
        3: 'moderator',
    };

    // Options shown in the dropdown (admin is intentionally excluded
    // so admins aren't demoted or promoted through this UI by accident)
    const ROLE_OPTIONS = [
        { value: 1, label: 'user' },
        { value: 3, label: 'moderator' },
    ];

    let selectedId = $state(null);
    let formValues = $state({ email: '', role: '' });
    let showSuccess = $state(false);
    let successTimer = null;

    const validUsers = $derived(
        users.filter((u) => u && u.email && Number(u.role) !== 2),
    );

    function triggerSuccess() {
        showSuccess = true;
        clearTimeout(successTimer);
        successTimer = setTimeout(() => {
            showSuccess = false;
        }, 3000);
    }

    function displayName(account) {
        const fullName = [account.first_name, account.last_name]
            .filter(Boolean)
            .join(' ')
            .trim();

        if (account.name) return account.name;
        if (fullName) return fullName;
        if (account.username) return account.username;
        if (account.email) return account.email;

        return `user-${account.id}`;
    }

    function accountRoleLabel(account) {
        const raw = Number(account.role);
        return ROLE_LABELS[raw] ?? 'user';
    }

    function viewUser(account) {
        selectedId = account.email;
        formValues = {
            email: account.email ?? '',
            role: String(account.role ?? 1),
        };
    }
</script>

<div class="admin-container">
    <AdminSidebar active="roles" userRole={user?.role ?? null} />

    <section class="content">
        <h1>roles</h1>

        {#if !isAdmin}
            <p class="access-denied">
                Geen toegang. Alleen beheerders kunnen deze pagina bekijken.
            </p>
        {:else}
            <div class="main-content">
                <div class="person-list-container">
                    <div class="person-list-header">
                        <span>naam</span>
                        <span>huidige rol</span>
                        <span></span>
                    </div>

                    <ul class="person-list">
                        {#each validUsers as account (account.email)}
                            <li class:selected={selectedId === account.email}>
                                <span class="person-name"
                                    >{displayName(account)}</span
                                >
                                <span class="person-role"
                                    >{accountRoleLabel(account)}</span
                                >
                                <button
                                    type="button"
                                    class="view-btn"
                                    onclick={() => viewUser(account)}
                                >
                                    bewerk rol
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="form-column">
                    <form
                        class="role-form"
                        method="POST"
                        action="?/upsert"
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

                        {#if selectedId}
                            <input
                                type="hidden"
                                name="email"
                                value={selectedId}
                            />
                        {/if}

                        <div class="form-group">
                            <label for="email">email</label>
                            <input
                                type="email"
                                id="email"
                                bind:value={formValues.email}
                                readonly
                            />
                        </div>

                        <div class="form-group">
                            <label for="role">rol</label>
                            <select
                                id="role"
                                name="role"
                                bind:value={formValues.role}
                            >
                                {#if formValues.role === '2'}
                                    <option value="2">admin</option>
                                {/if}
                                {#each ROLE_OPTIONS as roleOption}
                                    <option value={String(roleOption.value)}>
                                        {roleOption.label}
                                    </option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-actions">
                            <button
                                type="submit"
                                class="confirm-btn"
                                disabled={!selectedId}
                            >
                                opslaan
                            </button>
                        </div>
                    </form>
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

    .person-list-container,
    .role-form {
        background-color: hsl(var(--primary-h), var(--primary-s), 68%);
        border-radius: 4px;
        padding: 0.75rem;
    }

    .person-list-header {
        display: grid;
        grid-template-columns: 1fr 120px 100px;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        align-items: center;
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
        grid-template-columns: 1fr 120px 100px;
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

    .form-group {
        margin-bottom: 0.65rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
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

    .form-group select:disabled,
    .form-group input:disabled,
    .form-group input:readonly {
        opacity: 1;
        background-color: hsl(var(--primary-h), var(--primary-s), 75%);
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
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

    .confirm-btn:hover:not(:disabled) {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 35%);
    }

    .confirm-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .access-denied {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
    }

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
    }

    @media (max-width: 900px) {
        .main-content {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .admin-container {
            display: flex;
            flex-direction: column;
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
    }
</style>
