export const load = ({ cookies }) => {
    const session = cookies.get('user_session');
    if (!session) return { user: null };
    try {
        return { user: JSON.parse(session) };
    } catch {
        return { user: null };
    }
};
