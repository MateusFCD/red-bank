import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';

import { getCurrentUser, signOutUser, subscribeToAuthChanges } from '@/src/services/auth';

export interface AuthContextValue {
    user: User | null;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getCurrentUser());

    useEffect(() => subscribeToAuthChanges(setUser), []);

    const logout = useCallback(() => signOutUser(), []);

    const value = useMemo(() => ({ user, logout }), [user, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
