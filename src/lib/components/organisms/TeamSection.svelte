<script>
    import TeamCard from "$lib/components/molecules/TeamCard.svelte";

    export let title;
    export let subtitle;
    export let members = [];
</script>

<section class="team-section">
    <div class="container">
        <header class="heading">
            <h2>{title}</h2>
            {#if subtitle}
                <p>{subtitle}</p>
            {/if}
        </header>

        <div class="grid">
            {#each members as m (m.name)}
                <TeamCard member={m} />
            {/each}
        </div>
    </div>
</section>

<style>
    .team-section {
        padding: 80px 0;
    }

    .container {
        width: min(1100px, 92vw);
        margin: 0 auto;
    }

    /* HEADING */
    .heading {
        text-align: center;
        margin-bottom: 48px;
    }

    .heading h2 {
        font-size: var(--heading-1);
        text-transform: uppercase;
        margin-bottom: 20px;
    }

    .heading p {
        font-size: var(--paragraph-size);
        max-width: 720px;
        margin: 0 auto;
    }

    /* GRID */
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
    }

    @media (max-width: 900px) {
        .grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
