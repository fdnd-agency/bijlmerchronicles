# Code Structuur - Bijlmer Chronicles

## Project Overzicht

Dit project is gebouwd met **SvelteKit**. De code is onderverdeeld in twee hoofdgebieden: **Components** en **Routes** (pagina's).

---

## 📁 Folder Structuur

```
src/
├── lib/
│   ├── components/          # Herbruikbare UI-componenten
│   │   ├── atoms/          # Kleinste UI-blokken
│   │   ├── molecules/       # Combinaties van atoms
│   │   └── organisms/       # Complexe sectie-componenten
│   ├── assets/             # Afbeeldingen, fonts, logo's
│   ├── css/                # Globale stijlen
│   └── utils/              # Hulpfuncties
└──routes/                 # SvelteKit pagina's en API-routes
```

---

## 🧩 Components

De components zijn georganiseerd volgens de **Atomic Design**:

### **Atoms** 
Eenvoudige, zelfstandige elementen:
- `AmsterdamStarsSVG.svelte` 
- `NavDetailPagina.svelte` 
- `SearchIconSVG.svelte`

### **Molecules** - Groepen van atoms
Combinaties van meerdere atomaire elementen:
- `HamburgerMenu.svelte`
- `LemmaCard.svelte`
- `MapPreview.svelte`
- `SearchBar.svelte`

### **Organisms** - Complexe secties
Grote, zelfstandige componenten voor complete sectie:
- `Header.svelte`
- `Map.svelte`
- `DetailContent.svelte`

---

## 🛣️ Routes

SvelteKit gebruikt **file-based routing** - bestandsnamen bepalen URL's:

### **Root Layout** (`+layout.svelte`)
- Globale layout voor alle pagina's
- Header, footer, global styling

### **Root Page** (`+page.svelte`)
- Home pagina (`/`)

### **Dynamic Routes**
- `[id]` notatie betekent dynamische parameter
- Voorbeeld: `/wiki/3` → `+page.svelte` ontvangt `id = 'amsterdam-bijlmer'`

---

## 📊 Data Flow

### **Server-Side Rendering (+page.server.js)**
```javascript
// kaart/+page.server.js of wiki/[id]/+page.server.js
export async function load() {
  // Haal data van Directus API
  return {
    mapAddresses: [...],
    metadata: { ... }
  }
}
```
- Data wordt gepasseerd aan `+page.svelte`

### **Client-Side Rendering (+page.svelte)**
```svelte
<!-- wiki/[id]/+page.svelte -->
<script>
  export let data; // Ontvangen van server
</script>

{@html data.content}
```
- Gebruikt data van server

---

## 🎯 Workflow: Nieuwe Pagina Toevoegen

1. Maak folder in `src/routes/` (bijv. `mijnpagina/`)
2. Voeg `+page.svelte` toe (de zichtbare content)
3. Optioneel: voeg `+page.server.js` toe (data laden)
4. Route is automatisch beschikbaar op `/mijnpagina`

---

## 📦 Dependencies

- **SvelteKit** - Framework
- **Vite** - Bundler/Dev server
- **Leaflet** - Kaart library
- **Directus** - Headless CMS voor content
