export const seoConfig = {
	default: {
		title: "Encyclopédie Mapping Bijlmer Zuid-Oost: De Bijlmer Wiki",
		description: "Ontdek de rijke geschiedenis en cultuur van Amsterdam-Zuidoost met onze Encyclopédie Mapping Bijlmer."
	},
	"/kaart": {
		title: "Lemma's op de kaart van de Bijlmer - Encyclopédie Mapping",
		description: "Bekijk alle lemma's van Amsterdam-Zuidoost en de Bijlmer."
	},
	"/help": {
		title: "Help & Ondersteuning - Encyclopédie Mapping Bijlmer",
		description: "Hulp bij het gebruik van de Bijlmer Encyclopedie. Veelgestelde vragen en contactmogelijkheden."
	},
	"/navigatie": {
		title: "Navigatie & Routes - Encyclopédie Mapping Bijlmer",
		description: "Vind je weg door Amsterdam-Zuidoost. Routeplanner en bezienswaardigheden in de Bijlmer."
	},
	"/overons": {
		title: "Over Ons - Encyclopédie Mapping Bijlmer Project",
		description: "Leer over het team en het project achter de Bijlmer Encyclopedie. Onze missie en visie."
	},
	"/wiki": {
		title: "Bijlmer Wiki - Encyclopédie van Amsterdam-Zuidoost",
		description: "Complete encyclopedie over de Bijlmer. Geschiedenis, architectuur, cultuur en bewoners van Amsterdam-Zuidoost."
	},
	"/nieuwsbrief": {
		title: "Nieuwsbrief - Encyclopédie Mapping Bijlmer",
		description: "Blijf op de hoogte van nieuwe content en updates over de Bijlmer Encyclopedie. Schrijf je in voor onze nieuwsbrief."
	}
};

export function getSeoForPath(path) {
	// Zoek exacte match of fallback naar default
	return seoConfig[path] || seoConfig.default;
}