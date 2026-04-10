<script>
    let { data } = $props();
    const defaultImage = '/default-profile.png';
</script>

{#if data && data.member}
    <main class="member-grid">
        <h1>{data.member.name}</h1>

        <picture class="profile-picture">
            <source
                srcset={data.member.picture
                    ? `https://fdnd-agency.directus.app/assets/${data.member.picture}?format=avif`
                    : defaultImage}
                type="image/avif"
            />
            <source
                srcset={data.member.picture
                    ? `https://fdnd-agency.directus.app/assets/${data.member.picture}?format=webp`
                    : defaultImage}
                type="image/webp"
            />
            <img
                src={data.member.picture
                    ? `https://fdnd-agency.directus.app/assets/${data.member.picture}`
                    : defaultImage}
                alt={data.member.name}
            />
        </picture>

        <p class="role">{data.member.role || 'Functie'}</p>

        <p class="bio">
            {data.member.bio || 'Geen biografie beschikbaar'}
        </p>
    </main>
{:else}
    <p>Laden of teamlid niet gevonden...</p>
{/if}

<style>
    .member-grid {
        display: grid;
        grid-template-columns: 1fr;
        padding: 2rem 1.5rem;
        gap: 0.5rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        font-size: var(--heading-1);
        font-family: var(--main-font-black);
        text-transform: uppercase;
        color: var(--color-secondary);
        margin: 0;
    }

    .profile-picture {
        background-color: var(--color-primary-light);
        margin: 1rem 0;
        border: 3px solid var(--color-secondary);

        img {
            width: 100%;
            height: auto;
            display: block;
        }
    }

    .role {
        font-size: var(--paragraph-size);
        text-transform: uppercase;
        color: var(--color-secondary);
        margin: 0;
    }

    .bio {
        font-size: var(--paragraph-2);
        line-height: 1.6;
        margin: 0;
        white-space: pre-line;
    }

    @media (min-width: 768px) {
        .member-grid {
            grid-template-columns: 1fr 1.5fr;
            grid-template-areas:
                'photo name'
                'photo role'
                'photo bio';
            gap: 1rem 4rem;
            align-items: start;
            padding: 4rem 2rem;
        }

        .profile-picture {
            grid-area: photo;
            margin: 0;
            border: 3px solid var(--color-secondary);
            aspect-ratio: 3 / 4;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

        h1 {
            font-size: var(--heading-1);
            align-self: end;
        }

        .role {
            font-size: var(--heading-3);
        }
    }
</style>
