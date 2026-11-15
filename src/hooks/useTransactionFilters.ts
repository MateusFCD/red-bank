import { TransactionFiltersContext } from '@/src/context/TransactionFiltersContext';
import { createContextHook } from '@/src/hooks/createContextHook';

export const useTransactionFilters = createContextHook(
    TransactionFiltersContext,
    'useTransactionFilters',
);
