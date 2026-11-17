import { useShallow } from 'zustand/react/shallow';

import { countAppliedFilters } from '@/src/domain/filters';
import { useTransactionFiltersStore } from '@/src/stores/transactionFiltersStore';

export function useTransactionFilters() {
    return useTransactionFiltersStore(
        useShallow((state) => ({
            filters: state.filters,
            appliedFilterCount: countAppliedFilters(state.filters),
            setFilter: state.setFilter,
            toggleCategory: state.toggleCategory,
            clearFilters: state.clearFilters,
        })),
    );
}
