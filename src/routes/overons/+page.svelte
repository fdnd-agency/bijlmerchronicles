<script>
    import TeamSection from "$lib/components/organisms/TeamSection.svelte";
  
    const subtitle =
      "We werken samen om het bestaande werk van gidsen, kenners, kunstenaars en ondernemers te versterken die de waarde van deze buurt al hebben laten zien.";
  
    const teamMembers = [
      {
        name: "Graziella Hunsel Rivero",
        role: "Project Manager",
        bio: "Lorem Ipsum",
        image: "/images/Graziella.png",
        links: []
      },
      {
        name: "Candice Karikari",
        role: "Student",
        bio: "Lorem Ipsum",
        image: "/images/Candice.png",
        links: []
      },
      {
        name: "Núria Arbonés Aran",
        role: "Project Leider",
        bio: "Lorem Ipsum",
        image: "/images/Nuria.png"
      }
    ];
  </script>
  
  <TeamSection title="Over Ons" {subtitle} members={teamMembers} />
  