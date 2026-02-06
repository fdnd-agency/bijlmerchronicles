# Component Uitleg - Bijlmer Chronicles

Gedetailleerde beschrijving van de 6 belangrijkste componenten en hoe ze werken.

---

## 1. **NavDetailPagina** (Atom)

📍 Locatie: `src/lib/components/atoms/NavDetailPagina.svelte`

### Functie

Een **zijbalk/sidebar navigatie** voor detail pagina's (bijv. `/wiki/amsterdam`). Toont een "Inhoud" menu met links naar andere pagina's.

### Props

```svelte
export let title = "Navbardetailpagina";
```

- `title` - De titel van de sidebar (optioneel)

### Features

- **Sticky positie** - Blijft zichtbaar terwijl je scrollt (top: 15vh)
- **Collapse/Expand** - Details element dat expandeert/collapst
- **Animatie** - Sidebar schuift van links naar binnen (`sidebar-in` animatie)
- **Responsive** - Breedte past zich aan met `clamp()`

dit is momenteel al verwerkt in code maar nogbiet gelinkt aan interne links binnen de gerendere data pagina, de component bevind zich dus nog niet in een pagina en moet nog verwerkt worden

### Visueel

```
┌─────────────────┐
│ Inhoud          │
│ ─────────────── │
│ ▶ Ipsum         │  ← Clickable details summary
│   • Lorem Ipsum │
│   • Lorem Ipsum │
│   • Lorem Ipsum │
└─────────────────┘
```

### Gebruik

```svelte
<NavDetailPagina title="Pagina Inhoud" />
```

---

## 2. **HamburgerMenu** (Molecule)

📍 Locatie: `src/lib/components/molecules/HamburgerMenu.svelte`

### Functie

Een **responsieve hamburger menu** dat zich opent/sluit met animaties. Toont navigatie links op mobiele schermen.

### Features

- **Animaties** - SVG lijnen (top, middle, bottom) transformeren
- **Links animatie** - Elk link slide-in met vertraging
- **Focus management** - Toetsenbord navigatie met Tab/Escape
- **Scroll gedrag** - Menu sluit bij scrollen
- **Accessibility** - ARIA labels, focus trapping

### Event Handling

- **Click** - Toggle menu open/close
- **Keydown** - Escape sluit menu
- **Focus** - Trapping focus in menu
- **Scroll** - Sluit menu

### Gebruik

```svelte
<HamburgerMenu />
```

---

## 3. **SearchBar** (Molecule)

📍 Locatie: `src/lib/components/molecules/SearchBar.svelte`

### Functie

Een **zoekbalk** met input veld en submit button. Gebruiker kan hier zoeken naar locaties/lemma's.

### Props

```svelte
export let type = "Searchbar";
```

- `type` - Label voor accessibility (default: "Searchbar")

### Features

- **Form submission** - `on:submit` handler (moet nog afgemaakt worden)
- **Placeholder** - Voorbeeld zoekopdracht
- **Box shadow** - Visueel diepte effect op button
- **Focus states** - Outline en shadow op focus

---

## 4. **DetailContent** (Organism)

📍 Locatie: `src/lib/components/organisms/DetailContent.svelte`

### Functie

Toont de **detail inhoud van een lemma** (wiki artikel) met titel, afbeelding en tekst. Gebruikt geavanceerde CSS positioning.

### Props

```svelte
export let title = "Naam Lemma"; export let text = "Informatieve tekst"; export
let image = "";
```

- `title` - Titel van het lemma
- `text` - Beschrijvende tekst
- `image` - URL naar afbeelding (optioneel)

### Features

- **CSS Anchor Positioning** - Titel over afbeelding
- **Container Queries** - Responsive
- **Max-width** - Centered layout

inmiddels is de 'detailcontent' niet meer in gebruik en word de content direct geladen uit de database met @html lemma.body : https://github.com/fdnd-agency/bijlmerchronicles/blob/5ca03abf0a263c084a299e87711fe70f58cd19c6/src/routes/wiki/%5Bslug%5D/%2Bpage.svelte#L28

dit kan dus opnieuw worden geïntergreerd of compleet worden verwijderd gezien de code dus nu (even) niet in gebruik is.

---

## 5. **Header** (Organism)

📍 Locatie: `src/lib/components/organisms/Header.svelte`

### Functie

De **fixed navigatie header** bovenaan elke pagina. Bevat het logo, navigatie links, login buttons, en het hamburger menu.

### Components

- **Logo** - Link naar home (`/`)
- **Nav Links** - Nieuwsbrief, Over ons, Help, Kaart, Wiki
- **Login/Signup Buttons** - Gestijlde links met shadow effects
- **HamburgerMenu** - Responsive mobile menu

### Responsive Breakpoints

| Breedte | Wat tonen                            |
| ------- | ------------------------------------ |
| < 570px | Alleen hamburger + logo              |
| 570px+  | + Login/signup buttons               |
| 700px+  | + 1 nav link (Nieuwsbrief)           |
| 810px+  | + 2 nav links                        |
| 1025px+ | + Spacer layout (flex space-between) |
| 1625px+ | Alle 5 nav links zichtbaar           |

### Styling

- **Fixed positioning** - Blijft boven pagina
- **z-index: 10** - Boven andere content
- **min-height: 7.25rem** - Grote header
- **Hover effects** - Links worden `pop-out-color`

### Gebruik

```svelte
<Header />
```

---

## 6. **Map** (Organism)

📍 Locatie: `src/lib/components/organisms/Map.svelte`

### Functie

**Interactieve kaart** met markers die locaties toont. Gebouwd met **Leaflet.js** library.

### Props

```svelte
let {(mapAddresses, // Array van markers
(activeMapAddresses = []), // Geselecteerde markers
(mapClass = ''), // Custom CSS class
(initialZoom = 13), // Zoom level
(initialView = [52.32, 4.97]))} = $props();
```

### Features

#### 1. **Popup Content**

Bij hover/click opent popup met:

- Afbeelding
- Titel
- Summary
- Bekijk meer

#### 2. **Popup Interactie**

- **Hover** - Opent popup, sluit na .25s
- **Hover op popup** - Blijft open
- **Click** - Blijft open

#### 3. **Tile Layer**

### Data Structuur

Via directus

---
