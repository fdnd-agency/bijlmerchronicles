<script>
    let persons = $state([
        { id: 1, name: 'persoon 1', role: 'docent' },
        { id: 2, name: 'persoon 2', role: '' },
        { id: 3, name: 'persoon 3', role: '' },
        { id: 4, name: 'persoon 4', role: '' },
        { id: 5, name: 'persoon 5', role: '' },
        { id: 6, name: 'persoon 6', role: '' },
        { id: 7, name: 'persoon 7', role: '' },
        { id: 8, name: 'persoon 8', role: '' },
        { id: 9, name: 'persoon 8', role: '' }
    ]);

    let formData = $state({
        name: '',
        role: '',
        bio: '',
        photo: null
    });

    // eslint-disable-next-line no-unused-vars
    let selectedPerson = $state(null);

    function viewPerson(person) {
        selectedPerson = person;
        formData.name = person.name;
        formData.role = person.role || '';
        formData.bio = '';
        formData.photo = null;
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('Form submitted:', formData);
    }

    function handlePhotoUpload(event) {
        const file = event.target.files?.[0];
        if (file) {
            formData.photo = file;
        }
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

        <div class="main-content">
            <div class="person-list-container">
                <div class="person-list-header">
                    <span>persoon naam</span>
                    <span>role</span>
                    <span></span>
                </div>
                <ul class="person-list">
                    {#each persons as person}
                        <li>
                            <span class="person-name">{person.name}</span>
                            <span class="person-role">{person.role}</span>
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

            <form class="person-form" onsubmit={handleSubmit}>
                <div class="form-group">
                    <label for="name">name</label>
                    <input 
                        type="text" 
                        id="name" 
                        bind:value={formData.name}
                    />
                </div>

                <div class="form-group">
                    <label for="role">functie/role</label>
                    <input 
                        type="text" 
                        id="role" 
                        bind:value={formData.role}
                    />
                </div>

                <div class="form-group">
                    <label for="bio">bio beschrijving</label>
                    <textarea 
                        id="bio" 
                        rows="6"
                        bind:value={formData.bio}
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="photo">foto</label>
                    <label class="upload-btn">
                        upload foto
                        <input 
                            type="file" 
                            id="photo" 
                            accept="image/*"
                            onchange={handlePhotoUpload}
                            class="sr-only"
                        />
                    </label>
                </div>

                <button type="submit" class="confirm-btn">confirm</button>
            </form>
        </div>
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
        grid-template-columns: 1fr 100px 80px;
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
        grid-template-columns: 1fr 100px 80px;
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
        color: hsl(var(--secondary-h), var(--secondary-s), 17%);
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }

    .form-group input[type="text"],
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
        min-height: 80px;
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
        float: right;
        margin-top: 1.5rem;
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
            grid-template-columns: 1fr auto;
        }

        .person-list-header span:nth-child(2),
        .person-role {
            display: none;
        }
    }
</style>
