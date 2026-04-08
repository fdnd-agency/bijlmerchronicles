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

