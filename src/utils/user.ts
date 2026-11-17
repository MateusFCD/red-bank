import type { AuthUser } from '@/src/domain/auth/AuthUser';

export interface UserDisplayInfo {
    name: string;
    email: string;
    initial: string;
}

export function getUserDisplayInfo(user: AuthUser | null): UserDisplayInfo {
    const source = (user?.displayName || user?.email || 'U').trim();

    return {
        name: user?.displayName || 'Usuário Fluxo',
        email: user?.email || 'usuario@email.com',
        initial: (source[0] || 'U').toUpperCase(),
    };
}
