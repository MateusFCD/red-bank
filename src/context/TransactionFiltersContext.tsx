import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/src/hooks/useAuth';
import { countAppliedFilters, EMPTY_FILTERS, type TransactionFilters } from '@/src/domain/filters';

export interface TransactionFiltersContextValue {
    filters: TransactionFilters;
    appliedFilterCount: number;
    setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
    toggleCategory: (category: string) => void;
    clearFilters: () => void;
}

export const TransactionFiltersContext = createContext<TransactionFiltersContextValue | null>(null);

export function TransactionFiltersProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);

    const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

    // Filtros não devem "vazar" entre contas diferentes.
    useEffect(() => {
        if (!user) clearFilters();
    }, [user, clearFilters]);

    const setFilter = useCallback(
        <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
            setFilters((current) => ({ ...current, [key]: value }));
        },
        [],
    );

    const toggleCategory = useCallback((category: string) => {
        setFilters((current) => ({
            ...current,
            categories: current.categories.includes(category)
                ? current.categories.filter((name) => name !== category)
                : [...current.categories, category],
        }));
    }, []);

    const value = useMemo<TransactionFiltersContextValue>(
        () => ({
            filters,
            appliedFilterCount: countAppliedFilters(filters),
            setFilter,
            toggleCategory,
            clearFilters,
        }),
        [filters, setFilter, toggleCategory, clearFilters],
    );

    return (
        <TransactionFiltersContext.Provider value={value}>
            {children}
        </TransactionFiltersContext.Provider>
    );
}
