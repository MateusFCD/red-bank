import { useMemo } from 'react';

import { applyTransactionFilters } from '@/src/domain/filters';
import { getDistinctCategories } from '@/src/domain/transactions';
import { useTransactionFilters } from '@/src/hooks/useTransactionFilters';
import { useTransactions } from '@/src/hooks/useTransactions';

/** Combina os dados de transações com os filtros ativos. */
export function useFilteredTransactions() {
    const { transactions } = useTransactions();
    const { filters } = useTransactionFilters();

    const filteredTransactions = useMemo(
        () => applyTransactionFilters(transactions, filters),
        [transactions, filters],
    );

    const categories = useMemo(() => getDistinctCategories(transactions), [transactions]);

    return { filteredTransactions, categories };
}
