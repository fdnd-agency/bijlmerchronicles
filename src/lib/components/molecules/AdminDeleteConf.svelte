<script>
    import { enhance } from '$app/forms';

    let {
        open = false,
        itemName = '',
        id = '',
        action = '?/delete',
        confirmText = 'Ja, verwijder',
        cancelText = 'Annuleren',
        onCancel = () => {},
        onDeleted = () => {},
    } = $props();
</script>

{#if open}
    <div
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onclick={(e) => {
            if (e.target === e.currentTarget) onCancel();
        }}
        onkeydown={(e) => {
            if (e.key === 'Escape') onCancel();
        }}
    >
        <div class="modal">
            <p class="modal-message">
                Weet je zeker dat je <strong>{itemName}</strong> wilt verwijderen?
            </p>
            <div class="modal-actions">
                <form
                    method="POST"
                    {action}
                    use:enhance={() =>
                        async ({ result, update }) => {
                            await update({ reset: false });
                            if (
                                result.type === 'success' ||
                                result.data?.deleted
                            ) {
                                await onDeleted();
                            }
                        }}
                >
                    <input type="hidden" name="id" value={id} />
                    <button type="submit" class="modal-confirm-btn">
                        {confirmText}
                    </button>
                </form>
                <button
                    type="button"
                    class="modal-cancel-btn"
                    onclick={onCancel}
                >
                    {cancelText}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
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
</style>
