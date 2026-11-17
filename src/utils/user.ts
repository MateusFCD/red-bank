import type { User } from 'firebase/auth';

export interface UserDisplayInfo {
    name: string;
    email: string;
    initial: string;
}

export function getUserDisplayInfo(user: User | null): UserDisplayInfo {
    const source = (user?.displayName || user?.email || 'U').trim();

    return {
        name: user?.displayName || 'Usuário Fluxo',
        email: user?.email || 'usuario@email.com',
        initial: (source[0] || 'U').toUpperCase(),
    };
}
