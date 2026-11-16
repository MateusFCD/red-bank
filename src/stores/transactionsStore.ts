import type { DocumentSnapshot } from 'firebase/firestore';
import { create } from 'zustand';

import type { Transaction } from '@/src/interfaces';
import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
    type TransactionInput,
} from '@/src/services/transactions';
import { onAuthLogout } from '@/src/stores/authStore';

export interface TransactionsState {
    transactions: Transaction[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    lastDoc: DocumentSnapshot | null;

    loadTransactions: () => Promise<void>;
    loadMoreTransactions: () => Promise<void>;
    createTransaction: (transaction: TransactionInput) => Promise<void>;
    editTransaction: (id: string, transaction: TransactionInput) => Promise<void>;
    removeTransaction: (id: string) => Promise<void>;
    reset: () => void;
}

const initialTransactions = {
    transactions: [] as Transaction[],
    loading: false,
    loadingMore: false,
    hasMore: true,
    lastDoc: null as DocumentSnapshot | null,
};

// Trava síncrona: evita duas requisições da mesma página antes do re-render.
let fetchingMore = false;

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
    ...initialTransactions,

    async loadTransactions() {
        try {
            set({ loading: true });

            const page = await getTransactions();

            set({
                transactions: page.transactions,
                lastDoc: page.lastDoc,
                hasMore: page.hasMore,
            });
        } catch (error) {
            console.log('🔥 ERRO AO BUSCAR TRANSAÇÕES:', error);
        } finally {
            set({ loading: false });
        }
    },

    async loadMoreTransactions() {
        const { hasMore, lastDoc } = get();
        if (!hasMore || !lastDoc || fetchingMore) return;

        try {
            fetchingMore = true;
            set({ loadingMore: true });

            const page = await getTransactions(lastDoc);

            set((state) => ({
                transactions: [...state.transactions, ...page.transactions],
                lastDoc: page.lastDoc,
                hasMore: page.hasMore,
            }));
        } catch (error) {
            console.log('🔥 ERRO AO CARREGAR MAIS:', error);
        } finally {
            fetchingMore = false;
            set({ loadingMore: false });
        }
    },

    async createTransaction(transaction) {
        await addTransaction(transaction);
        await get().loadTransactions();
    },

    async editTransaction(id, transaction) {
        await updateTransaction(id, transaction);
        await get().loadTransactions();
    },

    async removeTransaction(id) {
        await deleteTransaction(id);
        set((state) => ({
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));
    },

    reset() {
        fetchingMore = false;
        set(initialTransactions);
    },
}));

onAuthLogout(() => {
    useTransactionsStore.getState().reset();
});
