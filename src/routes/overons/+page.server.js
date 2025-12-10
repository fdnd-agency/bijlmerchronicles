export async function load({ url }) {
  //hier komt het fetchen van data check oude server.js met alles
  const emibazoMembersResponse = await fetch(
    "https://fdnd-agency.directus.app/items/emibazo_persoon"
  );
  const emibazoMembersData = await emibazoMembersResponse.json();

  return { members: emibazoMembersData.data };
}