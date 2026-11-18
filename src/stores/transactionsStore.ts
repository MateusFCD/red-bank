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
import {
    clearUserCache,
    loadCachedTransactions,
    saveCachedTransactions,
} from '@/src/services/transactionsCache';
import { onAuthLogout, useAuthStore } from '@/src/stores/authStore';

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

// Transações exibidas a partir do cache cujo comprovante ainda não foi baixado.
let omittedReceiptIds = new Set<string>();

const currentUid = () => useAuthStore.getState().user?.uid ?? null;

/** Grava o estado atual no cache criptografado, sem bloquear a interface. */
function persistCache(uid: string, transactions: Transaction[]) {
    saveCachedTransactions(uid, transactions).catch((error) => {
        if (__DEV__) console.warn('Falha ao gravar cache de transações:', error);
    });
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
    ...initialTransactions,

    async loadTransactions() {
        const uid = currentUid();
        if (!uid) return;

        // Primeira abertura: mostra o cache local na hora enquanto busca no servidor.
        if (get().transactions.length === 0) {
            try {
                const cached = await loadCachedTransactions(uid);

                if (cached && currentUid() === uid && get().transactions.length === 0) {
                    omittedReceiptIds = cached.omittedReceiptIds;
                    set({ transactions: cached.transactions });
                }
            } catch (error) {
                if (__DEV__) console.warn('Falha ao ler cache de transações:', error);
            }
        }

        try {
            // Só mostra o carregamento quando não há nada (nem do cache) na tela.
            set({ loading: get().transactions.length === 0 });

            const page = await getTransactions();

            // O usuário pode ter saído durante a requisição: não exibe dados de outra sessão.
            if (currentUid() !== uid) return;

            omittedReceiptIds = new Set();
            set({
                transactions: page.transactions,
                lastDoc: page.lastDoc,
                hasMore: page.hasMore,
            });
            persistCache(uid, page.transactions);
        } catch (error) {
            if (__DEV__) console.warn('Erro ao buscar transações:', error);
        } finally {
            set({ loading: false });
        }
    },

    async loadMoreTransactions() {
        const { hasMore, lastDoc } = get();
        const uid = currentUid();
        if (!uid || !hasMore || !lastDoc || fetchingMore) return;

        try {
            fetchingMore = true;
            set({ loadingMore: true });

            const page = await getTransactions(lastDoc);
            if (currentUid() !== uid) return;

            set((state) => ({
                transactions: [...state.transactions, ...page.transactions],
                lastDoc: page.lastDoc,
                hasMore: page.hasMore,
            }));
            persistCache(uid, get().transactions);
        } catch (error) {
            if (__DEV__) console.warn('Erro ao carregar mais transações:', error);
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
        // Item vindo do cache sem comprovante baixado: se o usuário não escolheu
        // outro, não envia `receipt` para não apagar o que está salvo no servidor.
        if (omittedReceiptIds.has(id) && transaction.receipt === null) {
            const { receipt: _unchanged, ...withoutReceipt } = transaction;
            await updateTransaction(id, withoutReceipt);
        } else {
            await updateTransaction(id, transaction);
        }

        await get().loadTransactions();
    },

    async removeTransaction(id) {
        await deleteTransaction(id);
        omittedReceiptIds.delete(id);
        set((state) => ({
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
        }));

        const uid = currentUid();
        if (uid) persistCache(uid, get().transactions);
    },

    reset() {
        fetchingMore = false;
        omittedReceiptIds = new Set();
        set(initialTransactions);
    },
}));

onAuthLogout((previousUser) => {
    useTransactionsStore.getState().reset();

    // Apaga os dados e a chave do aparelho: nada da sessão anterior fica legível.
    clearUserCache(previousUser.uid).catch((error) => {
        if (__DEV__) console.warn('Falha ao limpar cache do usuário:', error);
    });
});
