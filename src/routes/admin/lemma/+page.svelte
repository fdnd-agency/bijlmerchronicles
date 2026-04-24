<script>
    import { goto, invalidateAll } from '$app/navigation';
    import AdminDeleteConf from '$lib/components/molecules/AdminDeleteConf.svelte';
    import AdminSidebar from '$lib/components/molecules/AdminSidebar.svelte';
    import LemmaForm from '$lib/components/organisms/LemmaForm.svelte';
    import LemmaList from '$lib/components/organisms/LemmaList.svelte';

    /** @type {import('./$types').PageData} */
    const { data, form } = $props();

    const lemmas = $derived(data.lemmas ?? []);
    const user = $derived(data.user);
    const isAdmin = $derived(user?.role === 2);

    const EMPTY_FORM_VALUES = {
        title: '',
        address: '',
        summary: '',
        body: '',
        slug: '',
        bouwjaar: '',
        geo_lat: '',
        geo_lng: '',
    };

    let selectedId = $state(null);
    let formValues = $state({ ...EMPTY_FORM_VALUES });
    let showSuccess = $state(false);
    let successTimer = null;
    let showDeleteModal = $state(false);

    function normalizeBouwjaar(value) {
        const text = value?.toString?.().trim() ?? '';
        const match = text.match(/\b(\d{4})\b/);
        return match ? match[1] : '';
    }

    function keepYearOnly(value) {
        return (value?.toString?.() ?? '').replace(/\D/g, '').slice(0, 4);
    }

    function resetForm() {
        selectedId = null;
        formValues = { ...EMPTY_FORM_VALUES };
        showDeleteModal = false;
    }

    function triggerSuccess() {
        showSuccess = true;
        clearTimeout(successTimer);
        successTimer = setTimeout(() => {
            showSuccess = false;
        }, 3000);
    }

    function extractGeo(geolocation) {
        if (!geolocation) {
            return { lat: '', lng: '' };
        }

        if (
            geolocation?.coordinates &&
            Array.isArray(geolocation.coordinates) &&
            geolocation.coordinates.length >= 2
        ) {
            return {
                lng: geolocation.coordinates[0] ?? '',
                lat: geolocation.coordinates[1] ?? '',
            };
        }

        if (typeof geolocation === 'string') {
            const pointMatch = geolocation.match(
                /POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i,
            );
            if (pointMatch) {
                return {
                    lng: pointMatch[1],
                    lat: pointMatch[2],
                };
            }
        }

        return { lat: '', lng: '' };
    }

    function viewLemma(lemma) {
        selectedId = lemma.id;
        formValues = {
            ...EMPTY_FORM_VALUES,
            title: lemma.title ?? '',
            address: lemma.address ?? '',
            summary: lemma.summary ?? '',
            body: lemma.body ?? '',
            slug: lemma.slug ?? '',
            bouwjaar: normalizeBouwjaar(lemma.bouwjaar),
        };
        showDeleteModal = false;

        const geo = extractGeo(lemma.geolocation);
        formValues.geo_lat = geo.lat?.toString?.() ?? '';
        formValues.geo_lng = geo.lng?.toString?.() ?? '';
    }

    function newLemma() {
        resetForm();
    }

    function updateField(field, value) {
        formValues[field] = value;
    }

    function updateBody(value) {
        formValues.body = value;
    }

    function updateGeo({ lat, lng }) {
        formValues.geo_lat = lat;
        formValues.geo_lng = lng;
    }

    function updateBouwjaar(value) {
        formValues.bouwjaar = keepYearOnly(value);
    }

    function lemmaFormEnhance() {
        return async ({ result, update }) => {
            await update({ reset: false });

            if (result.type === 'success' || result.data?.success) {
                if (result.data?.lemmaId && !selectedId) {
                    selectedId = result.data.lemmaId;
                }

                if (result.data?.previewUrl) {
                    await goto(result.data.previewUrl);
                    return;
                }

                await invalidateAll();
                triggerSuccess();
            }
        };
    }

    async function handleDeleteSuccess() {
        resetForm();
        await invalidateAll();
    }
</script>

<div class="admin-container">
    <AdminSidebar active="lemma" />

    <section class="content">
        <h1>Lemma's</h1>

        {#if !isAdmin}
            <p class="access-denied">
                Geen toegang. Alleen beheerders kunnen deze pagina bekijken.
            </p>
        {:else}
            <div class="main-content">
                <LemmaList
                    {lemmas}
                    {selectedId}
                    onView={viewLemma}
                    onNew={newLemma}
                />

                <div class="form-column">
                    <LemmaForm
                        {form}
                        {showSuccess}
                        {selectedId}
                        {formValues}
                        onEnhance={lemmaFormEnhance}
                        onFieldUpdate={updateField}
                        onBodyChange={updateBody}
                        onGeoChange={updateGeo}
                        onBouwjaarInput={updateBouwjaar}
                        onOpenDelete={() => (showDeleteModal = true)}
                    />

                    <AdminDeleteConf
                        open={showDeleteModal}
                        itemName={formValues.title}
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
