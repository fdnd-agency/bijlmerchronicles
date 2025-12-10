<!-- /overons/+page.svelte -->
<script>
    export let data;
    const { members = [] } = data;
</script>

<main>

    <section class="over-ons-section">
        <h2>Over Ons</h2>
        <p>Wij zijn een consortium van partners geworteld in Amsterdam-Zuidoost die zich inzetten om Amsterdam-Zuidoost beter op de hoogte te brengen.</p>
        <p>We werken samen om het bestaande werk van gidsen, kenners, kunstenaars en ondernemers te versterken die de waarde van deze buurt al hebben laten zien.</p>
    </section>

    <section class="ons-team-heading">
        <h3>Ons Team</h3>
        <p>Maak kennis met de mensen achter dit project</p>

        {#each members as person}
            <article class="member-info">
                <h4>{person.name}</h4>
                <aside class="role">{person.role}</aside><p>{person.bio}</p>
            </article>
        {/each}

    </section>

    <section class="onze-partners">
        <h3>Onze Partners</h3>
        <p>HIER KOMEN ONZE PARTNERS</p>
    </section>

</main>

<style>

    h2, h3 {
        font-family: var(--main-font-black);
        text-transform: uppercase;
    }

    h2 {
        font-size: var(--heading-2);
    }

    h3 {
        font-size: var(--heading-4);
    }

    h4 {
        font-size: var(--heading-3);
    }

    p {
        font-size: var(--paragraph-3);
    }

    aside{
        font-size: var(--paragraph-2);
        font-weight: bold;
    }

    /*----------------------------------- Grid-layour voor de main zodat alles mooi uitgelijnd is --------------------------------------*/
    @layer grid {

        :root {
            --grid-colomn-amount: 12; /* Veranderd op mobile */
            --grid-columns: repeat(var(--grid-colomn-amount), 1fr);
            --grid-gap: 8px;
        }

        @media (min-width: 768px) {
            :root {
                --grid-colomn-amount: 16;
                --grid-columns: repeat(var(--grid-colomn-amount), 1fr);
                --grid-gap: 12px;
            }
        }

        @supports (grid-template-columns: subgrid) {

            main {
                display: grid;
                grid-template-columns: var(--grid-columns);
                gap: var(--grid-gap);
            }

            section,
            article {
                display: grid;
                grid-template-columns: subgrid;
                grid-column: 1 / var(--grid-colomn-amount);

                > * {
                    grid-column: 2 / -1;
                }
            }
        }

    }
</style>
