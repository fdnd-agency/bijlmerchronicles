# Afspraken over samenwerking

## Commit conventies

- Wij gebruiken [code conventies](https://www.conventionalcommits.org/nl/v1.0.0/) van FDND zelf, hier proberen wij ons ook aan te houden.
- Begin met Feat: / Fix: / Refactor:  / Documentatie:
- Altijd #issue nummer in de titel als er een issue voor is gemaakt
- Engelse omschrijving, duidelijk maar  niet te lang

## Onze gitflow

- Vanaf de Dev branch een feature branch maken
- Deze geef je de naam van de corresponderende issue
- Begin je branch naam met Feat: / Fix: / Refactor:  / Documentatie:
- Er mag naar de Dev gemerged worden als er een akkoord van een teamlid is gegeven op de Pull Request.

### Pull request

Pull Request template:

- In het Engels
- Wat is er veranderd? Korte omschrijving
- Link het issue nummer
- Aangeven hoe het is getest
- Beeldmateriaal van eindresultaat (als dit van toepassing is)
- Aangeven waar de reviewer op moet letten

Wij volgen de gitflow van [gitkraken.com](https://www.gitkraken.com/learn/git/git-flow#the-git-flow-workflow), als wij een branch gaan bouwen, zullen wij de branch houden aan het component waarvoor de issue gemaakt is, als voorbeeld, stel het component is 'home-button' zullen we via de issue drukken op 'create a branch' zodat deze issue direct gekoppeld is aan de branch:

<img width="430" height="689" alt="image" src="https://github.com/user-attachments/assets/2ec9267a-c6f1-41a0-9769-0a414a3a170e" />

### Issues & project board

- Issues assignen aan 1 persoon tegelijk (als er hulp nodig is, een voor een in de issue/branch werken om merge conlficten te voorkomen)
- Zodra je begint met werken aan de issue verplaats je hem naar de In Progres kolom
- Als je issue klaar is en de Pull Request gemerged is dan kan de issue naar Done
- Project board bij de daily standup bespreken

### Definition of Ready (DoR) user story

- De user story is opgezet volgens de "Als gebruiker/admin/systeem ... wil ik... omdat..."
- Alle subissues bekend zijn
- De subissues zijn in de backlog naar "Todo" gezet
- Planning poker gedaan is
- De story ingeschat is op haalbaar binnen een sprint

### Definition of Done (DoD) user story

- Als alle subissues af zijn gerond
- De styling overeen komt met het ontwerp
- Toegankelijkheid is getest (toetsenbord, contrast, lighthouse)
- Code voldoet aan de coding conventies
- De RAPPE princiepes zijn aangehouden en getest
- Code is gereviewd en gemerged
- Documentatie is bijgewerkt

## Code Conventies:

- **Naamgeving**: kebab-case voor classes in css, Javascript en components in svelte gebruiken wij camelCase. Altijd engels, geen afkortingen
- **Comments**: Moeilijke coden uitleggen en documenten onder vedelen in stukken, dus bijvoorbeeld animaties krijgen een lange comment. Voorbeeld: /_----------------------------------- Animatie --------------------------------------_/
- **Supports / Supporten van website op alle browsers**: @Supports gebruiken bij nieuwere functies en bij animaties.
- **Witregels**: FDND conventies aanhouden

## Communicatie

### Remote

- Via Teams chat / call in overleg
- Github doormiddel van een @
- Wanneer mogenlijk op werkdagen zsm reactie, binnen 24u
- Zo ver mogenlijk van te voren melden wanneer je gepland afwezig bent
- Bij ziekte aangeven als je afwezig bent en of je evt thuis wel of niet verder kan werken
- Bij blokkades eerst met het team overleggen, daarna met mede agency genoten, als er dan nog een blokkade is aan een docent vragen

AFSRPAKEN: ELKE START VAN DE DAG EEN STAND-UP

## FDND conventies

Voor het bouwen van deze website volgen wij de fdnd conventies:
https://docs.fdnd.nl/conventies.html
