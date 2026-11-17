import { useShallow } from 'zustand/react/shallow';

import { useTransactionsStore } from '@/src/stores/transactionsStore';

export function useTransactions() {
    return useTransactionsStore(
        useShallow((state) => ({
            transactions: state.transactions,
            loading: state.loading,
            loadingMore: state.loadingMore,
            hasMore: state.hasMore,
            loadTransactions: state.loadTransactions,
            loadMoreTransactions: state.loadMoreTransactions,
            createTransaction: state.createTransaction,
            editTransaction: state.editTransaction,
            removeTransaction: state.removeTransaction,
        })),
    );
}
