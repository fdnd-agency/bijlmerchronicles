# EMIBAZO — Project Handover

> An interactive, map-based encyclopedia about Amsterdam-Zuidoost.
> Built with SvelteKit (frontend) and Directus (backend).

**For:** the next development team · FDND Agency
**Backlog:** all unstarted issues live on the [project board](https://github.com/orgs/fdnd-agency/projects/83) under the **Product backlog** column.

---

## TL;DR

The app works end to end: an interactive map pulls lemmas from the database, the wiki renders their content, and there's a working auth flow plus an admin dashboard. The main job ahead is making the site fully editable by administrators (text, images, SVGs, and the connections between lemmas), plus translation and a handful of scoped features. Start by reading our last few sprint reviews and the product backlog.

---

## What's built

### Pages

| Page | Notes |
|------|-------|
| Homepage | — |
| Map | Dynamic system that fetches lemmas from the database |
| Wiki | Displays the specific data for each lemma |
| Admin panel | Restricted to admins and moderators |
| Login | Working |
| Registration | Working |
| Lemma layout | Reworked |
| Connecting the dots | Connections between lemmas |

### Working features

- Interactive map with dynamic points loaded from the database.
- Map dots that link through to their corresponding lemmas ("connecting the dots").
- Modal popup for lemmas shown on the map.
- Extensive hamburger menu.
- Working login and registration pages.
- Admin dashboard gated to admin/moderator roles only.

---

## Where to look first

Review our **most recent sprint reviews** before anything else — they show exactly what was demoed and what's still missing, which is the fastest way to get current.

One area still to flesh out is the **detail page**. Confirm with the client what each detail page should show and how it ties into the existing map and wiki views.

---

## Open work

Grouped roughly by theme.

### Editable / dynamic content
The client wants to manage essentially everything herself.

- Make **all text** editable — every piece of copy should become dynamic, not hardcoded.
- Make **SVGs and images** dynamic too, not just text.
- Make the **connections between lemmas editable** — let an admin click a lemma and link it to another directly.

### Content workflow
- When a new lemma is added, **create it straight from the admin panel** so it doesn't have to be typed twice.

### Translation & search
- **Translate** the website into multiple languages.
- Add **Catalan** as one of the languages.
- Make **search diacritic-insensitive** — e.g. typing "Nuria" should still match "Núria" even though the name officially carries the accent.

### New features & pages
- Allow lemmas to be **downloaded as PDFs**.
- Build the **new pages** (content for these still needs to be delivered by the client).

---

## Suggested order of attack

1. **Scope the "make everything editable" request with the client.** It ranges from simple text/image editing to a near page-builder. Agree on how far it goes and which pages come first before writing code — otherwise it balloons past the project timeline.
2. **Fix the content workflow.** Creating lemmas directly in the admin panel is well-scoped, high-value, and removes duplicate typing. Good early win.
3. **Translation + diacritic-insensitive search.** Self-contained and client-requested; can ship independently of the bigger dynamic-content work. Catalan included.
4. **Detail pages, new pages, lemma PDF export, editable connections.** Build these out as content arrives and the system matures.

---

## Design system

A design system was set up for EMIBAZO as part of the FDND Agency assignment. Its goal is to make the design consistent, scalable, and easy to hand over to a future team. Every choice is based on an interface inventory and live inspection of the existing website.

[**Figma file**](https://www.figma.com/design/1MDK8LQPFwIbxLA76gQaQi/Interface-Inventory-Design-System?node-id=175-315&t=fRxBkWdSAGj62BPz-1)

**What's delivered**

- **Foundations** — all design tokens are documented in Figma and based on EMIBAZO's existing house style: colour (primary, secondary, text, background), typography (Waukegan LDO E, all sizes and weights), spacing (a 4px-based scale with semantic tokens), border radius (cards and buttons), and shadows (the hard shadow used on cards).
- **Components** — built from the tokens, with relevant states documented: Primary Button (Login), Secondary Button (Register), Search Button, Search Input, Location card, Profile card, and Navigation.
- **Documentation** — a "How to use this design system?" section in the Figma file explains how to design new pages, use existing components, and add new ones.

**Still to expand**

- Flesh out the hamburger menu component states.
- Add hover and active states to the buttons.
- Add do's & don'ts per component.

---

## Notes for the next team

Some of this was built under time pressure, so a few solutions are practical rather than final. Keep it maintainable for the students who come after you:

- Keep server files readable.
- Keep Directus communication centralised.
- Document the important systems.
- Keep the admin panel consistent.
- Avoid unnecessary duplication.
- Discuss large features with the client *before* building them.

---

## Wrap-up

The project is in a usable state — map, wiki, auth, and the admin dashboard all work, with lemmas loaded dynamically from the database. The biggest remaining effort is the fully-dynamic editing experience (text, images, SVGs, lemma connections), alongside translation, search improvements, and the new pages. Scope these carefully with the client; her expectations may call for a larger technical solution than the current setup. The recent sprint reviews and the product backlog are your best starting point.
