# Handover 

## De Status

De huidige status van het project is dat de pagina de volgende pagina's bevat:
- Homepagina
- Kaart met een dynamisch systeem om de lemma's uit de database op te halen
- Wiki die de specifieke data toont van de lemma's

## Belangrijke features
Dit zijn de belangrijke en werkende features van de website:
- Een werkende map met dymanische punten van de database.
- Een modal popup op de lemma's op de kaart
- Een uitgebreid hamburger menu

## Aandachtspunten of Uitdagingen

De grootste aandachtspunten en uitdagingen in ons project zijn:

### De dynamische kaart te laten werken met de lemma's uit de database
Elke lemma heeft zijn eigen titel, kleine summary, een plaatje en de coordinaten van waar het is. Dit word allemaal opgehaald in de map en getoond. 

### Het hamburger menu
Het hamburger menu is een compleet werkend menu zowel met javascript als zonder. De code is dan ook een met veel complexe front-end code in elkaar gezet en vraagt speciale aandacht. twee belangrijke punten zijn bijvoorbeeld:

- De [:has](https://github.com/fdnd-agency/bijlmerchronicles/blob/1ec6daa25cb0173f3cdc55fe9f9a170a9b254bfd/src/lib/css/global-styles.css#L152) selector binnen css in de global-styles.css die ervoor zorgt dat er een blur komt zodra een bepaalde class in het document is.
- De popover api die word verwijderd in javascript maar zodra javascript uitstaat ervoor zorgt dat het menu nog open gaat.

### Detailpagina

## Stappen voor het volgende team
**- Componenten layout:** Neem de layout van onze component structure goed door, met de atoms, molecules en organisms. 

**- Read.me:** Lees de [read.me](https://github.com/fdnd-agency/bijlmerchronicles/blob/dev/README.md) goed door, hierin leggen we vrijwel alles uit over het project.

**- Contributing.md:** Lees de [contriubting](https://github.com/fdnd-agency/bijlmerchronicles/blob/dev/CONTRIBUTING.md) door voor onze workflow en conventies

**- Database:** Neem onze [mermaid](https://github.com/fdnd-agency/bijlmerchronicles/issues/4) door om te kijken hoe wij onze database hebben ingericht.

**- Wont have (this time):** Neem onze laatste openstaande issues door zodat je het verder kan oppakken.


