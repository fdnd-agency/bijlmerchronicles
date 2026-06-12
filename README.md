# Bijlmer Chronicles — Imaginaries Mapping

> A wiki-style encyclopedia and interactive map for discovering Amsterdam-Zuidoost.
> Built with SvelteKit and Directus. **Live:** https://emibazo.netlify.app/

---

## The team

| Name | Role |
|------|------|
| Alun | Project lead / Developer |
| Rick | Developer |
| Johan | Developer |

---

## About us

We're a consortium of partners rooted in Amsterdam-Zuidoost, working to make the neighbourhood better known. Our aim is to strengthen the existing work of the guides, experts, artists, and entrepreneurs who have already shown how much this area has to offer.

## About the project

This project is a wiki/encyclopedia for exploring Zuidoost. The platform gathers information about points of interest across the neighbourhood and makes it easy and accessible for visitors to discover new places through an interactive map and its accompanying encyclopedia.

---

## Design choices

The homepage carries the colours of Zuidoost throughout. It pairs a navigation bar with a section of lemmas and an embedded map — click a point on the map and you land on the matching lemma.

**Desktop**

<img width="1920" height="1004" alt="Desktop view" src="https://github.com/user-attachments/assets/9fa8c278-fc1b-45d4-a444-4ecd27a5ac4b" />

**Map**

<img width="1921" height="869" alt="Map view" src="https://github.com/user-attachments/assets/1b86ec7f-b36b-4ecf-9e2a-56128b78beea" />

*With connections between lemmas:*

<img width="617" height="423" alt="Map with connections" src="https://github.com/user-attachments/assets/6480f5ec-95c7-493a-95a7-50d13f93f3fc" />

**Mobile**

<img width="649" height="688" alt="Mobile view" src="https://github.com/user-attachments/assets/03e051ee-09c1-448f-9c9d-2f8f801da17b" />

---

## User guide

### Navigation

A simple top navigation gives you three pages:

- **🏠 Home** — landing page with an overview of Bijlmer Chronicles
- **🗺️ Map** — interactive map with every lemma in Zuidoost
- **ℹ️ About** — background on the project and its partners
- **🔑 Login / Register** — create an account or sign in
- **🛠️ Admin panel** — content management, restricted to admins and moderators

### How it works

1. **Open the site** — head to https://emibazo.netlify.app/
2. **Explore via the map**
   - Open **Map** and click a marker.
   - Each marker shows a popup with an image, name, and short summary of the lemma.
   - Click **Read more** to open the full entry in the encyclopedia.
3. **On mobile**
   - Tap the hamburger menu (☰) to navigate on smaller screens.
   - Every feature works on mobile too.

### Tip

The map is interactive: click it to keep the popup open.

### Accounts: login & registration

The site has a working authentication flow:

- **Register** — create a new account from the sign-up page.
- **Login** — sign in with your credentials to access account-restricted areas.
- Your role determines what you can do once signed in (see below).

### Admin panel

Signed-in users with an **admin** or **moderator** role get access to the admin dashboard for managing content. Regular visitors don't see it.

From the panel an administrator can:

- Create, edit, and delete lemmas.
- Manage the content shown across the site.
- Keep everything in one place instead of editing the database directly.

> **Access is role-based:** only admins and moderators can reach the dashboard. Regular accounts are limited to browsing the site.

---

## Key documentation

- **[Handover](https://github.com/fdnd-agency/bijlmerchronicles/blob/dev/HANDOVER.md)** — start here to pick up the project.
- **[Contributing](https://github.com/fdnd-agency/bijlmerchronicles/blob/dev/CONTRIBUTING.md)** — our workflow, conventions, and Git flow.
- **[`/docs`](https://github.com/fdnd-agency/bijlmerchronicles/tree/dev/docs)** — the CMS/database we use, the code structure, and component explanations.

---

## Getting started

Clone the repo and install dependencies:

```sh
npm install
```

Run the local dev server:

```sh
npm run dev

# …or start the server and open it in a new browser tab:
npm run dev -- --open
```

> To deploy the app, you may need an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
