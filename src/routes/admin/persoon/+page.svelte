<script>
    import { invalidateAll } from '$app/navigation';
    import AdminDeleteConf from '$lib/components/molecules/AdminDeleteConf.svelte';
    import AdminSidebar from '$lib/components/molecules/AdminSidebar.svelte';
    import PersonForm from '$lib/components/organisms/PersonForm.svelte';
    import PersonList from '$lib/components/organisms/PersonList.svelte';

    /** @type {import('./$types').PageData} */
    const { data, form } = $props();

    const DIRECTUS_ASSETS = 'https://fdnd-agency.directus.app/assets';
    const EMPTY_PERSON_FORM = { name: '', role: '', bio: '' };

    const persons = $derived(data.persons ?? []);
    const user = $derived(data.user);
    const isAdmin = $derived(user?.role === 2);

    let selectedId = $state(null);
    let selectedPhoto = $state(null);
    let formValues = $state({ ...EMPTY_PERSON_FORM });
    let showSuccess = $state(false);
    let successTimer = null;
    let showDeleteModal = $state(false);

    function resetPersonForm() {
        selectedId = null;
        selectedPhoto = null;
        formValues = { ...EMPTY_PERSON_FORM };
        showDeleteModal = false;
    }

    function updatePersonField(field, value) {
        formValues = { ...formValues, [field]: value };
    }

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
        formValues = {
            ...EMPTY_PERSON_FORM,
            name: person.name ?? '',
            role: person.role ?? '',
            bio: person.bio ?? '',
        };
        showDeleteModal = false;
    }

    async function handleDeleteSuccess() {
        resetPersonForm();
        await invalidateAll();
    }

    function photoUrl(photo) {
        if (!photo) return null;
        if (photo.startsWith?.('http')) return photo;
        return `${DIRECTUS_ASSETS}/${photo}`;
    }

    function personFormEnhance() {
        return async ({ result, update }) => {
            await update({ reset: false });

            if (result.type === 'success' || result.data?.success) {
                await invalidateAll();
                triggerSuccess();
            }
        };
    }
</script>

<div class="admin-container">
    <AdminSidebar active="persoon" />

    <section class="content">
        <h1>persoon</h1>

        {#if !isAdmin}
            <p class="access-denied">
                Geen toegang. Alleen beheerders kunnen deze pagina bekijken.
            </p>
        {:else}
            <div class="main-content">
                <PersonList
                    {persons}
                    {selectedId}
                    {photoUrl}
                    onView={viewPerson}
                    onNew={resetPersonForm}
                />

                <div>
                    <PersonForm
                        {form}
                        {showSuccess}
                        {selectedId}
                        {selectedPhoto}
                        {formValues}
                        {photoUrl}
                        onFieldUpdate={updatePersonField}
                        onOpenDelete={() => (showDeleteModal = true)}
                        onEnhance={personFormEnhance}
                    />

                    <AdminDeleteConf
                        open={showDeleteModal}
                        itemName={formValues.name}
                        id={selectedId}
                        onCancel={() => (showDeleteModal = false)}
                        onDeleted={handleDeleteSuccess}
                    />
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

    .access-denied {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
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
