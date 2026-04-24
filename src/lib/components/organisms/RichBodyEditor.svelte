<script>
    const TOOLBAR_ACTIONS = [
        { label: 'B', aria: 'Vet', command: 'bold' },
        { label: 'I', aria: 'Cursief', command: 'italic' },
        { label: 'U', aria: 'Onderstrepen', command: 'underline' },
        { label: 'H2', aria: 'Kop 2', command: ['formatBlock', '<h2>'] },
        { label: 'H3', aria: 'Kop 3', command: ['formatBlock', '<h3>'] },
        {
            label: 'UL',
            aria: 'Opsomming',
            command: 'insertUnorderedList',
        },
        {
            label: 'OL',
            aria: 'Genummerde lijst',
            command: 'insertOrderedList',
        },
        {
            label: 'Q',
            aria: 'Citaat',
            command: ['formatBlock', '<blockquote>'],
        },
        { label: 'Link', aria: 'Link', action: 'link' },
        { label: 'Img', aria: 'Afbeelding', action: 'image' },
        { label: '</>', aria: 'Code', command: ['formatBlock', '<pre>'] },
    ];

    let {
        value = '',
        onChange = () => {},
        editorId = 'body-editor',
    } = $props();

    let bodyEditor = $state(null);
    let bodyImageInput = $state(null);

    function emitChange(nextValue) {
        onChange(nextValue);
    }

    function applyBodyCommand(command, commandValue = null) {
        if (!bodyEditor) return;
        bodyEditor.focus();
        document.execCommand(command, false, commandValue);
        emitChange(bodyEditor.innerHTML);
    }

    function runToolbarCommand(command) {
        if (Array.isArray(command)) {
            applyBodyCommand(command[0], command[1]);
            return;
        }

        applyBodyCommand(command);
    }

    function insertBodyLink() {
        const url = window.prompt('Voer een URL in:');
        if (url) applyBodyCommand('createLink', url);
    }

    function insertBodyImage() {
        bodyImageInput?.click?.();
    }

    function runToolbarAction(action) {
        if (action === 'link') {
            insertBodyLink();
            return;
        }

        if (action === 'image') {
            insertBodyImage();
        }
    }

    function handleBodyImageUpload(event) {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imgUrl = reader.result;
            if (typeof imgUrl !== 'string') return;

            const imgHtml = `<img src="${imgUrl}" alt="Afbeelding" class="body-image" />`;

            if (!bodyEditor) return;
            bodyEditor.focus();
            document.execCommand('insertHTML', false, imgHtml);
            emitChange(bodyEditor.innerHTML);
        };

        reader.readAsDataURL(file);
        event.currentTarget.value = '';
    }

    function onBodyInput() {
        if (!bodyEditor) return;
        emitChange(bodyEditor.innerHTML);
    }

    $effect(() => {
        if (!bodyEditor) return;
        const nextValue = value ?? '';
        if (bodyEditor.innerHTML !== nextValue) {
            bodyEditor.innerHTML = nextValue;
        }
    });
</script>

<div class="form-group">
    <label for={editorId}>beschrijving (body)</label>
    <div class="rich-editor" role="group" aria-label="Body editor">
        <div class="rich-toolbar">
            {#each TOOLBAR_ACTIONS as item}
                <button
                    type="button"
                    aria-label={item.aria}
                    onclick={() =>
                        item.action
                            ? runToolbarAction(item.action)
                            : runToolbarCommand(item.command)}
                >
                    {item.label}
                </button>
            {/each}
        </div>

        <div
            id={editorId}
            class="rich-content"
            contenteditable="true"
            role="textbox"
            aria-multiline="true"
            oninput={onBodyInput}
            bind:this={bodyEditor}
        ></div>
    </div>

    <input
        type="file"
        id="body-image-input"
        class="sr-only"
        accept="image/*"
        onchange={handleBodyImageUpload}
        bind:this={bodyImageInput}
    />
</div>

<style>
    .form-group {
        margin-bottom: 0.65rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }

    .rich-editor {
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 2px;
        overflow: hidden;
        background: hsl(var(--primary-h), var(--primary-s), 85%);
    }

    .rich-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        align-items: center;
        padding: 0.5rem;
        border-bottom: 1px solid
            hsl(var(--secondary-h), var(--secondary-s), 17%);
        background: hsl(var(--primary-h), var(--primary-s), 75%);
    }

    .rich-toolbar button {
        border: 1px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 3px;
        background: hsl(var(--primary-h), var(--primary-s), 68%);
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        min-width: 2rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        cursor: pointer;
        font-family: var(--main-font);
        transition: background-color 0.2s ease;
    }

    .rich-toolbar button:hover {
        background: hsl(var(--primary-h), var(--primary-s), 60%);
    }

    .rich-content {
        min-height: 220px;
        padding: 0.75rem;
        background: hsl(var(--primary-h), var(--primary-s), 85%);
        color: #000000;
        line-height: 1.6;
        font-size: 0.95rem;
        outline: none;
    }

    .rich-content:focus {
        box-shadow: inset 0 0 0 1px
            hsl(var(--secondary-h), var(--secondary-s), 35%);
    }

    .rich-content :global(.body-image) {
        max-width: 100%;
        height: auto;
        border-radius: 2px;
        margin: 0.75rem 0;
        display: block;
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
