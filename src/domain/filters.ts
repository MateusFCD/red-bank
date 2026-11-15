import type { FilterType, Transaction } from '@/src/interfaces';
import { parseAmount } from '@/src/utils/format';

export interface TransactionFilters {
    type: FilterType;
    categories: string[];
    /** ISO date (inclusive). */
    from: string;
    /** ISO date (inclusive). */
    to: string;
    /** Texto digitado pelo usuário, ex.: "1.234,56". */
    min: string;
    max: string;
}

export const EMPTY_FILTERS: TransactionFilters = {
    type: 'all',
    categories: [],
    from: '',
    to: '',
    min: '',
    max: '',
};

export function applyTransactionFilters(
    transactions: Transaction[],
    filters: TransactionFilters,
): Transaction[] {
    const min = parseAmount(filters.min);
    const max = parseAmount(filters.max);

    return transactions.filter((t) => {
        if (filters.type !== 'all' && t.type !== filters.type) return false;
        if (filters.categories.length > 0 && !filters.categories.includes(t.category)) return false;
        if (filters.from && t.date < filters.from) return false;
        if (filters.to && t.date > filters.to) return false;
        if (min !== null && t.amount < min) return false;
        if (max !== null && t.amount > max) return false;
        return true;
    });
}

export function countAppliedFilters(filters: TransactionFilters): number {
    return [
        filters.type !== 'all',
        filters.categories.length > 0,
        !!filters.from,
        !!filters.to,
        !!filters.min,
        !!filters.max,
    ].filter(Boolean).length;
}
