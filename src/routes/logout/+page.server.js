import { redirect } from '@sveltejs/kit';

export const prerender = false;

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies }) => {
        cookies.delete('user_session', { path: '/' });
        throw redirect(302, '/');
    },
};
