<script>
    let { active = '' } = $props();

    const links = [
        { href: '/admin/lemma', label: "Lemma's", key: 'lemma' },
        { href: '/admin/persoon', label: 'persoon', key: 'persoon' },
        { href: '/admin/comments', label: 'comments', key: 'comments' },
    ];
</script>

<aside class="sidebar">
    <nav>
        {#each links as link}
            <a href={link.href} class:active={active === link.key}>
                {link.label}
            </a>
        {/each}
    </nav>
</aside>

<style>
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

    @media (max-width: 600px) {
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
    }
</style>
