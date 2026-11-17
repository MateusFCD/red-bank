import { create } from 'zustand';

import { getCurrentSession, signOut, subscribeToSession } from '@/src/composition/auth';
import type { AuthUser } from '@/src/domain/auth/AuthUser';

export interface AuthState {
    user: AuthUser | null;
    logout: () => Promise<void>;
}

const logoutListeners = new Set<() => void>();

/** Registra limpeza de outros stores quando a sessão termina. */
export function onAuthLogout(listener: () => void) {
    logoutListeners.add(listener);
}

export const useAuthStore = create<AuthState>(() => ({
    user: getCurrentSession(),
    logout: signOut,
}));

subscribeToSession((user) => {
    const previous = useAuthStore.getState().user;
    useAuthStore.setState({ user });

    if (previous && !user) {
        logoutListeners.forEach((listener) => listener());
    }
});
