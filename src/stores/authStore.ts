import type { User } from 'firebase/auth';
import { create } from 'zustand';

import { getCurrentUser, signOutUser, subscribeToAuthChanges } from '@/src/services/auth';

export interface AuthState {
    user: User | null;
    logout: () => Promise<void>;
}

const logoutListeners = new Set<() => void>();

/** Registra limpeza de outros stores quando a sessão termina. */
export function onAuthLogout(listener: () => void) {
    logoutListeners.add(listener);
}

export const useAuthStore = create<AuthState>(() => ({
    user: getCurrentUser(),
    logout: signOutUser,
}));

subscribeToAuthChanges((user) => {
    const previous = useAuthStore.getState().user;
    useAuthStore.setState({ user });

    if (previous && !user) {
        logoutListeners.forEach((listener) => listener());
    }
});
