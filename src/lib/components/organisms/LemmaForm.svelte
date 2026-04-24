<script>
    import { enhance } from '$app/forms';
    import AdminForm from '$lib/components/molecules/AdminForm.svelte';
    import GeoMapPicker from '$lib/components/organisms/GeoMapPicker.svelte';
    import RichBodyEditor from '$lib/components/organisms/RichBodyEditor.svelte';

    let {
        form = null,
        showSuccess = false,
        selectedId = null,
        formValues = {
            title: '',
            address: '',
            summary: '',
            body: '',
            slug: '',
            bouwjaar: '',
            geo_lat: '',
            geo_lng: '',
        },
        onEnhance = () => async () => {},
        onFieldUpdate = () => {},
        onBodyChange = () => {},
        onGeoChange = () => {},
        onBouwjaarInput = () => {},
        onOpenDelete = () => {},
    } = $props();
</script>

<form
    class="lemma-form"
    method="POST"
    action="?/upsert"
    enctype="multipart/form-data"
    use:enhance={onEnhance}
>
    <AdminForm error={form?.error} success={showSuccess} />

    {#if selectedId}
        <input type="hidden" name="id" value={selectedId} />
    {/if}

    <div class="form-group">
        <label for="address">address</label>
        <input
            type="text"
            id="address"
            name="address"
            value={formValues.address}
            oninput={(e) => onFieldUpdate('address', e.currentTarget.value)}
        />
    </div>

    <div class="form-group">
        <label for="title">titel</label>
        <input
            type="text"
            id="title"
            name="title"
            required
            value={formValues.title}
            oninput={(e) => onFieldUpdate('title', e.currentTarget.value)}
        />
    </div>

    <RichBodyEditor value={formValues.body} onChange={onBodyChange} />
    <input type="hidden" name="body" value={formValues.body} />

    <div class="form-group">
        <label for="bouwjaar">bouwjaar</label>
        <input
            type="text"
            id="bouwjaar"
            name="bouwjaar"
            inputmode="numeric"
            maxlength="4"
            value={formValues.bouwjaar}
            oninput={(e) => onBouwjaarInput(e.currentTarget.value)}
        />
    </div>

    <GeoMapPicker
        lat={formValues.geo_lat}
        lng={formValues.geo_lng}
        onChange={onGeoChange}
    />
    <input type="hidden" name="geo_lat" value={formValues.geo_lat} />
    <input type="hidden" name="geo_lng" value={formValues.geo_lng} />

    <div class="form-group">
        <label for="summary">summary</label>
        <input
            type="text"
            id="summary"
            name="summary"
            value={formValues.summary}
            oninput={(e) => onFieldUpdate('summary', e.currentTarget.value)}
        />
    </div>

    <div class="form-group">
        <label for="slug">slug</label>
        <input
            type="text"
            id="slug"
            name="slug"
            value={formValues.slug}
            oninput={(e) => onFieldUpdate('slug', e.currentTarget.value)}
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
            <button type="button" class="delete-btn" onclick={onOpenDelete}>
                verwijder lemma
            </button>
        {/if}

        <button type="submit" name="intent" value="preview" class="preview-btn">
            preview
        </button>

        <button type="submit" name="intent" value="save" class="confirm-btn">
            {selectedId ? 'opslaan' : 'aanmaken'}
        </button>
    </div>
</form>

<style>
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

    .form-group input[type='text'] {
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

    .preview-btn {
        background-color: transparent;
        border: 1px solid hsl(var(--secondary-h), var(--secondary-s), 25%);
        color: hsl(var(--secondary-h), var(--secondary-s), 25%);
        padding: 0.35rem 0.75rem;
        border-radius: 2px;
        cursor: pointer;
        font-size: 0.8rem;
        transition:
            background-color 0.2s ease,
            color 0.2s ease;
    }

    .preview-btn:hover {
        background-color: hsl(var(--secondary-h), var(--secondary-s), 25%);
        color: white;
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
</style>
