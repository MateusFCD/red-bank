import type { ReactNode } from 'react';

import { AuthProvider } from '@/src/context/AuthContext';
import { TransactionsProvider } from '@/src/context/TransactionsContext';
import { TransactionFiltersProvider } from '@/src/context/TransactionFiltersContext';

/** Compõe os providers da aplicação. Cada um tem uma única responsabilidade. */
export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <TransactionsProvider>
                <TransactionFiltersProvider>{children}</TransactionFiltersProvider>
            </TransactionsProvider>
        </AuthProvider>
    );
}
