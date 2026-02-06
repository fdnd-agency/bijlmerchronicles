<script>
    import TeamCard from '$lib/components/molecules/TeamCard.svelte';
    import TeamSection from '$lib/components/organisms/TeamSection.svelte';

    export let data;
    const { members = [] } = data;

    const subtitle =
        'We werken samen om het bestaande werk van gidsen, kenners, kunstenaars en ondernemers te versterken die de waarde van deze buurt al hebben laten zien.';
</script>

<TeamSection title="Over Ons" {subtitle} {members} />

<!--
  <section class="team-grid">
    {#each members as m (m.id)}
      <TeamCard member={m} />
    {/each}
  </section>
  -->
