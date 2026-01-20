export async function load({ params, fetch }) {

    try {
    // Haal het specifieke emibazo_lemma item op basis van de id uit de URL
        const lemmaId = params.id;
        const emibazoApiUrl = `https://fdnd-agency.directus.app/items/emibazo_lemma/${lemmaId}`;
        
        const emibazoLemmaResponse = await fetch(emibazoApiUrl);
        
        const emibazoLemmasData = await emibazoLemmaResponse.json();
        const lemma = emibazoLemmasData.data;

    // Retourneer alleen de benodigde velden voor de wiki pagina
        return {
            lemma: {
            id: lemma.id,
            title: lemma.title,
            body: lemma.body,
            address: lemma.address,
            bouwjaar: lemma.bouwjaar
            }
        };

    // Foutafhandeling
    }catch (error) {
        console.error('Error fetching lemma from API', error);
        return { lemma: null };
    }

}