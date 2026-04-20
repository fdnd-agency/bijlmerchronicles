<script>
    let { error = '', success = false, successText = 'Opgeslagen!' } = $props();
</script>

{#if error}
    <p class="form-error">{error}</p>
{/if}

{#if success}
    <p class="form-success">{successText}</p>
{/if}

<style>
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
</style>
