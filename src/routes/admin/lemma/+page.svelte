<script>
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';

    /** @type {import('./$types').PageData} */
    const { data, form } = $props();

    const lemmas = $derived(data.lemmas ?? []);
    const user = $derived(data.user);
    const isAdmin = $derived(user?.role === 2);

    // Bijlmer default centre
    const DEFAULT_LAT = 52.316;
    const DEFAULT_LNG = 4.974;

    let selectedId = $state(null);
    let formValues = $state({
        title: '',
        address: '',
        summary: '',
        body: '',
        slug: '',
        bouwjaar: '',
        geo_lat: '',
        geo_lng: '',
    });
    let showSuccess = $state(false);
    let successTimer = null;
    let showDeleteModal = $state(false);

    /** Leaflet map instance & marker */
    let leaflet = $state(null);
    let map = $state(null);
    let marker = $state(null);

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
        formValues.title = lemma.title ?? '';
        formValues.address = lemma.address ?? '';
        formValues.summary = lemma.summary ?? '';
        formValues.body = lemma.body ?? '';
        formValues.slug = lemma.slug ?? '';
        formValues.bouwjaar = lemma.bouwjaar ?? '';
        showDeleteModal = false;

        // Extract geolocation from object or WKT string
        const geo = extractGeo(lemma.geolocation);
        formValues.geo_lat = geo.lat?.toString?.() ?? '';
        formValues.geo_lng = geo.lng?.toString?.() ?? '';

        // Update map marker after tick
        setTimeout(() => updateMapMarker(), 50);
    }

    function newLemma() {
        selectedId = null;
        formValues = {
            title: '',
            address: '',
            summary: '',
            body: '',
            slug: '',
            bouwjaar: '',
            geo_lat: '',
            geo_lng: '',
        };
        showDeleteModal = false;
        setTimeout(() => updateMapMarker(), 50);
    }

    /* ── Leaflet map ── */
    async function initMap(node) {
        // Dynamically import Leaflet
        const L =
            await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
        leaflet = L;

        map = L.map(node, {
            worldCopyJump: false,
            maxBounds: [
                [-85, -180],
                [85, 180],
            ],
            maxBoundsViscosity: 1.0,
        }).setView(
            [
                parseFloat(formValues.geo_lat) || DEFAULT_LAT,
                parseFloat(formValues.geo_lng) || DEFAULT_LNG,
            ],
            14,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
            noWrap: true,
        }).addTo(map);

        // Place marker if we already have coords
        if (formValues.geo_lat && formValues.geo_lng) {
            marker = L.marker([
                parseFloat(formValues.geo_lat),
                parseFloat(formValues.geo_lng),
            ]).addTo(map);
        }

        // Click to set location
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            formValues.geo_lat = lat.toFixed(6);
            formValues.geo_lng = lng.toFixed(6);

            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng]).addTo(map);
            }
        });

        updateMapMarker();
    }

    function updateMapMarker() {
        if (!map || !leaflet) return;
        const lat = parseFloat(formValues.geo_lat);
        const lng = parseFloat(formValues.geo_lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            map.invalidateSize();
            map.setView([lat, lng], 15);
            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = leaflet.marker([lat, lng]).addTo(map);
            }
        } else {
            map.setView([DEFAULT_LAT, DEFAULT_LNG], 14);
            if (marker) {
                marker.remove();
                marker = null;
            }
        }
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossorigin=""
    />
</svelte:head>

<div class="admin-container">
    <aside class="sidebar">
        <nav>
            <a href="/admin/lemma" class="active">Lemma's</a>
            <a href="/admin/persoon">persoon</a>
            <a href="/admin/comments">comments</a>
        </nav>
    </aside>

    <section class="content">
        <h1>Lemma's</h1>

        {#if !isAdmin}
            <p class="access-denied">
                Geen toegang. Alleen beheerders kunnen deze pagina bekijken.
            </p>
        {:else}
            <div class="main-content">
                <!-- ─── Left: lemma list ─── -->
                <div class="lemma-list-container">
                    <div class="lemma-list-header">
                        <span>lemma titel</span>
                        <button
                            type="button"
                            class="new-btn"
                            onclick={newLemma}
                        >
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
                                        onclick={() => viewLemma(lemma)}
                                    >
                                        bekijk meer
                                    </button>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>

                <!-- ─── Right: form ─── -->
                <div class="form-column">
                    <form
                        class="lemma-form"
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

                        {#if selectedId}
                            <input type="hidden" name="id" value={selectedId} />
                        {/if}

                        <div class="form-group">
                            <label for="address">address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                bind:value={formValues.address}
                            />
                        </div>

                        <div class="form-group">
                            <label for="title">titel</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                bind:value={formValues.title}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="body">beschrijving (body)</label>
                            <textarea
                                id="body"
                                name="body"
                                rows="8"
                                bind:value={formValues.body}
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label for="bouwjaar">bouwjaar</label>
                            <input
                                type="text"
                                id="bouwjaar"
                                name="bouwjaar"
                                bind:value={formValues.bouwjaar}
                            />
                        </div>

                        <!-- Geo location: clickable map -->
                        <div class="form-group">
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label
                                >geo locatie <small
                                    >(klik op de kaart om locatie te kiezen)</small
                                ></label
                            >
                            <div class="map-wrapper" use:initMap></div>
                            <div class="geo-inputs">
                                <input
                                    type="text"
                                    name="geo_lat"
                                    placeholder="latitude"
                                    bind:value={formValues.geo_lat}
                                    readonly
                                />
                                <input
                                    type="text"
                                    name="geo_lng"
                                    placeholder="longitude"
                                    bind:value={formValues.geo_lng}
                                    readonly
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="summary">summary</label>
                            <input
                                type="text"
                                id="summary"
                                name="summary"
                                bind:value={formValues.summary}
                            />
                        </div>

                        <div class="form-group">
                            <label for="slug">slug</label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                bind:value={formValues.slug}
                            />
                        </div>

                        <div class="form-group">
                            <label for="posterimage">poster afbeelding</label>
                            <label class="upload-btn">
                                upload afbeelding
                                <input
                                    type="file"
                                    id="posterimage"
                                    name="posterimage"
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
                                    verwijder lemma
                                </button>
                            {/if}
                            <button type="submit" class="confirm-btn">
                                {selectedId ? 'opslaan' : 'aanmaken'}
                            </button>
                        </div>
                    </form>

                    <!-- Delete confirmation modal -->
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
                                        >{formValues.title}</strong
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
                                                    formValues = {
                                                        title: '',
                                                        address: '',
                                                        summary: '',
                                                        body: '',
                                                        slug: '',
                                                        bouwjaar: '',
                                                        geo_lat: '',
                                                        geo_lng: '',
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
    /* ─── Layout ─── */
    .admin-container {
        display: grid;
        grid-template-columns: 200px 1fr;
        min-height: calc(100vh - var(--header-height, 10vh));
    }

    /* ─── Sidebar ─── */
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

    /* ─── Content ─── */
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

    /* ─── Lemma list (left panel) ─── */
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

    /* ─── Form (right panel) ─── */
    .lemma-form {
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

    .form-group label small {
        font-size: 0.75rem;
        opacity: 0.7;
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

    /* ─── Map ─── */
    .map-wrapper {
        width: 100%;
        height: 250px;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 2px;
        margin-bottom: 0.5rem;
        z-index: 0;
    }

    .geo-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .geo-inputs input {
        width: 100%;
        padding: 0.4rem;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 2px;
        background-color: hsl(var(--primary-h), var(--primary-s), 85%);
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        font-family: var(--main-font);
        font-size: 0.85rem;
        box-sizing: border-box;
    }

    /* ─── Upload button ─── */
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

    /* ─── Form actions ─── */
    .form-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 1.5rem;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

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

    /* ─── Modal ─── */
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

    /* ─── Feedback ─── */
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

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* ─── Responsive ─── */
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
    }
</style>
