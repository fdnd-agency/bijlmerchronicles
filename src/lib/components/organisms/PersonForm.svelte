<script>
    import { enhance } from '$app/forms';
    import AdminForm from '$lib/components/molecules/AdminForm.svelte';

    const PERSON_FIELDS = [
        { id: 'name', label: 'name', type: 'text', required: true },
        { id: 'role', label: 'functie/role', type: 'text' },
        { id: 'bio', label: 'bio beschrijving', type: 'textarea', rows: 6 },
    ];

    let {
        form = null,
        showSuccess = false,
        selectedId = null,
        selectedPhoto = null,
        formValues = { name: '', role: '', bio: '' },
        photoUrl = () => null,
        onFieldUpdate = () => {},
        onOpenDelete = () => {},
        onEnhance = () => async () => {},
    } = $props();
</script>

<form
    class="person-form"
    method="POST"
    action="?/upsert"
    enctype="multipart/form-data"
    use:enhance={onEnhance}
>
    <AdminForm error={form?.error} success={showSuccess} />

    {#if selectedId}
        <input type="hidden" name="id" value={selectedId} />
    {/if}

    {#each PERSON_FIELDS as field}
        <div class="form-group">
            <label for={field.id}>{field.label}</label>

            {#if field.type === 'textarea'}
                <textarea
                    id={field.id}
                    name={field.id}
                    rows={field.rows}
                    value={formValues[field.id]}
                    oninput={(e) =>
                        onFieldUpdate(field.id, e.currentTarget.value)}
                ></textarea>
            {:else}
                <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    required={field.required}
                    value={formValues[field.id]}
                    oninput={(e) =>
                        onFieldUpdate(field.id, e.currentTarget.value)}
                />
            {/if}
        </div>
    {/each}

    <div class="form-group">
        <label for="photo">foto</label>
        {#if selectedPhoto}
            <div class="photo-preview">
                <img src={photoUrl(selectedPhoto)} alt="huidige foto" />
            </div>
        {/if}
        <label class="upload-btn">
            {selectedPhoto ? 'foto vervangen' : 'upload foto'}
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
            <button type="button" class="delete-btn" onclick={onOpenDelete}>
                verwijder persoon
            </button>
        {/if}
        <button type="submit" class="confirm-btn">
            {selectedId ? 'opslaan' : 'aanmaken'}
        </button>
    </div>
</form>

<style>
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
