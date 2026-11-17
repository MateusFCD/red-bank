import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/src/stores/authStore';

export function useAuth() {
    return useAuthStore(
        useShallow((state) => ({
            user: state.user,
            logout: state.logout,
        })),
    );
}
