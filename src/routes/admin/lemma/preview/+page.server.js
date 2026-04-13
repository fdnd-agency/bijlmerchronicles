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

    if (!user || user.role !== 2) {
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

    return { draft };
}
