import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { DocumentSnapshot } from 'firebase/firestore';

import { useAuth } from '@/src/hooks/useAuth';
import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
    type TransactionInput,
} from '@/src/services/transactions';
import type { Transaction } from '@/src/interfaces';

export interface TransactionsContextValue {
    transactions: Transaction[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;

    loadTransactions: () => Promise<void>;
    loadMoreTransactions: () => Promise<void>;
    createTransaction: (transaction: TransactionInput) => Promise<void>;
    editTransaction: (id: string, transaction: TransactionInput) => Promise<void>;
    removeTransaction: (id: string) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Trava síncrona: evita duas requisições da mesma página antes do re-render.
    const fetchingMoreRef = useRef(false);

    // Os dados pertencem ao usuário logado: ao sair, o cache é descartado.
    useEffect(() => {
        if (user) return;

        setTransactions([]);
        setLastDoc(null);
        setHasMore(true);
    }, [user]);

    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);

            const page = await getTransactions();

            setTransactions(page.transactions);
            setLastDoc(page.lastDoc);
            setHasMore(page.hasMore);
        } catch (error) {
            console.log('🔥 ERRO AO BUSCAR TRANSAÇÕES:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMoreTransactions = useCallback(async () => {
        if (!hasMore || !lastDoc || fetchingMoreRef.current) return;

        try {
            fetchingMoreRef.current = true;
            setLoadingMore(true);

            const page = await getTransactions(lastDoc);

            setTransactions((current) => [...current, ...page.transactions]);
            setLastDoc(page.lastDoc);
            setHasMore(page.hasMore);
        } catch (error) {
            console.log('🔥 ERRO AO CARREGAR MAIS:', error);
        } finally {
            fetchingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [hasMore, lastDoc]);

    const createTransaction = useCallback(
        async (transaction: TransactionInput) => {
            await addTransaction(transaction);
            await loadTransactions();
        },
        [loadTransactions],
    );

    const editTransaction = useCallback(
        async (id: string, transaction: TransactionInput) => {
            await updateTransaction(id, transaction);
            await loadTransactions();
        },
        [loadTransactions],
    );

    const removeTransaction = useCallback(async (id: string) => {
        await deleteTransaction(id);
        setTransactions((current) => current.filter((t) => t.id !== id));
    }, []);

    const value = useMemo<TransactionsContextValue>(
        () => ({
            transactions,
            loading,
            loadingMore,
            hasMore,
            loadTransactions,
            loadMoreTransactions,
            createTransaction,
            editTransaction,
            removeTransaction,
        }),
        [
            transactions,
            loading,
            loadingMore,
            hasMore,
            loadTransactions,
            loadMoreTransactions,
            createTransaction,
            editTransaction,
            removeTransaction,
        ],
    );

    return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}
