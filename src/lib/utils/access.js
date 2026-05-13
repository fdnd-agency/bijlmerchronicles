// Shared access helpers for admin/moderator checks
export function isAdmin(user) {
    return !!(user && Number(user.role) === 2);
}

export function canManageContent(user) {
    // Admins (2) and moderators (3) may manage content
    const role = user && Number(user.role);
    return role === 2 || role === 3;
}

export default { isAdmin, canManageContent };
