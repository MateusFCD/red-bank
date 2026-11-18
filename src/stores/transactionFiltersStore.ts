import { create } from 'zustand';

import { EMPTY_FILTERS, type TransactionFilters } from '@/src/domain/filters';
import { onAuthLogout } from '@/src/stores/authStore';

export interface TransactionFiltersState {
    filters: TransactionFilters;
    setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
    toggleCategory: (category: string) => void;
    clearFilters: () => void;
}

export const useTransactionFiltersStore = create<TransactionFiltersState>((set) => ({
    filters: EMPTY_FILTERS,

    setFilter(key, value) {
        set((state) => ({ filters: { ...state.filters, [key]: value } }));
    },

    toggleCategory(category) {
        set((state) => ({
            filters: {
                ...state.filters,
                categories: state.filters.categories.includes(category)
                    ? state.filters.categories.filter((name) => name !== category)
                    : [...state.filters.categories, category],
            },
        }));
    },

    clearFilters() {
        set({ filters: EMPTY_FILTERS });
    },
}));

onAuthLogout(() => {
    useTransactionFiltersStore.getState().clearFilters();
});
