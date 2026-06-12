import { redirect } from '@sveltejs/kit';

export const prerender = false;

const DIRECTUS_BASE = 'https://fdnd-agency.directus.app';
const TOKEN = 'KgmHEY4JMPOziWmiyxp03MuT4mT26bcs';

function normalizeBouwjaar(value) {
    const text = value?.toString?.().trim() ?? '';
    const match = text.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
}

async function fetchLemmaById(fetch, id) {
    const res = await fetch(
        `${DIRECTUS_BASE}/items/emibazo_lemma/${id}?fields=*`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
        },
    );

    if (!res.ok) {
        return null;
    }

    const json = await res.json();
    return json.data ?? null;
}

// Haal alle lemma's en personen op zodat de preview dezelfde interne links
// kan tonen als de echte wiki-pagina.
async function fetchLinkTargets(fetch) {
    try {
        const [resLemmas, resPeople] = await Promise.all([
            fetch(`${DIRECTUS_BASE}/items/emibazo_lemma`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }),
            fetch(`${DIRECTUS_BASE}/items/emibazo_persoon`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }),
        ]);

        const jsonLemmas = resLemmas.ok ? await resLemmas.json() : null;
        const jsonPeople = resPeople.ok ? await resPeople.json() : null;

        return {
            allLemmas: (jsonLemmas?.data ?? []).map((l) => ({
                id: l.id,
                slug: l.slug,
                title: l.title,
            })),
            allPeople: (jsonPeople?.data ?? []).map((p) => ({
                id: p.id,
                name: p.name,
            })),
        };
    } catch {
        return { allLemmas: [], allPeople: [] };
    }
}

function canAccessAdmin(user) {
    return user?.role === 2 || user?.role === 3;
}

export async function load({ url, fetch, cookies }) {
    const session = cookies.get('user_session');
    let user = null;

    if (session) {
        try {
            user = JSON.parse(session);
        } catch {
            /* ignore */
        }
    }

    if (!canAccessAdmin(user)) {
        throw redirect(302, '/');
    }

    const id = url.searchParams.get('id')?.trim() || null;

    let baseLemma = null;
    if (id) {
        try {
            baseLemma = await fetchLemmaById(fetch, id);
        } catch {
            baseLemma = null;
        }
    }

    const { allLemmas, allPeople } = await fetchLinkTargets(fetch);

    const draft = {
        id,
        title: url.searchParams.get('title') ?? baseLemma?.title ?? '',
        address: url.searchParams.get('address') ?? baseLemma?.address ?? '',
        summary: url.searchParams.get('summary') ?? baseLemma?.summary ?? '',
        body: url.searchParams.get('body') ?? baseLemma?.body ?? '',
        slug: url.searchParams.get('slug') ?? baseLemma?.slug ?? '',
        bouwjaar: normalizeBouwjaar(
            url.searchParams.get('bouwjaar') ?? baseLemma?.bouwjaar,
        ),
        geo_lat: url.searchParams.get('geo_lat') ?? '',
        geo_lng: url.searchParams.get('geo_lng') ?? '',
    };

    return { draft, allLemmas, allPeople };
}
