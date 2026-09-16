import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { DocumentSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

import { auth } from '@/src/services/firebase';
import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
} from '@/src/services/transactions';
import type { FilterType, Transaction } from '@/src/interfaces';

/** Turns a "1.234,56" style input into a number, or null when it's empty/invalid. */
function parseAmount( value: string ): number | null {
    if (!value.trim()) return null;

    const normalized = value.replace(/\./g, '').replace(',', '.');
    const amount = Number(normalized);

    return Number.isNaN(amount) ? null : amount;
}

export interface AppContextValue {
    // auth
    user: User | null;
    logout: () => Promise<void>;

    // transactions data
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    distinctCategories: string[];

    // transactions actions
    loadTransactions: () => Promise<void>;
    loadMoreTransactions: () => Promise<void>;
    createTransaction: ( transaction: Omit<Transaction, 'id'> ) => Promise<void>;
    editTransaction: (
        id: string,
        transaction: Omit<Transaction, 'id'>
    ) => Promise<void>;
    removeTransaction: ( id: string ) => Promise<void>;

    // filters
    filtersOpen: boolean;
    toggleFilters: () => void;
    filterType: FilterType;
    setFilterType: ( type: FilterType ) => void;
    filterCategories: string[];
    toggleCategoryFilter: ( category: string ) => void;
    filterFrom: string;
    setFilterFrom: ( value: string ) => void;
    filterTo: string;
    setFilterTo: ( value: string ) => void;
    filterMin: string;
    setFilterMin: ( value: string ) => void;
    filterMax: string;
    setFilterMax: ( value: string ) => void;
    clearFilters: () => void;
    appliedFilterCount: number;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider( { children }: { children: ReactNode } ) {
    const [user, setUser] = useState<User | null>(auth.currentUser);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [filterCategories, setFilterCategories] = useState<string[]>([]);
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');
    const [filterMin, setFilterMin] = useState('');
    const [filterMax, setFilterMax] = useState('');

    useEffect(() => onAuthStateChanged(auth, setUser), []);

    const logout = useCallback(async () => {
        await signOut(auth);

        setTransactions([]);
        setLastDoc(null);
        setHasMore(true);
        clearFilters();
    }, []);

    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getTransactions();

            setTransactions(data.transactions);
            setLastDoc(data.lastDoc);
            setHasMore(data.hasMore);
        } catch (error) {
            console.log('🔥 ERRO AO BUSCAR TRANSAÇÕES:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMoreTransactions = useCallback(async () => {
        if (!hasMore || loadingMore || !lastDoc) return;

        try {
            setLoadingMore(true);

            const data = await getTransactions(lastDoc);

            setTransactions(( current ) => [...current, ...data.transactions]);
            setLastDoc(data.lastDoc);
            setHasMore(data.hasMore);
        } catch (error) {
            console.log('🔥 ERRO AO CARREGAR MAIS:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [hasMore, loadingMore, lastDoc]);

    const createTransaction = useCallback(
        async ( transaction: Omit<Transaction, 'id'> ) => {
            await addTransaction(transaction);
            await loadTransactions();
        },
        [loadTransactions]
    );

    const editTransaction = useCallback(
        async ( id: string, transaction: Omit<Transaction, 'id'> ) => {
            await updateTransaction(id, transaction);
            await loadTransactions();
        },
        [loadTransactions]
    );

    const removeTransaction = useCallback(
        async ( id: string ) => {
            await deleteTransaction(id);
            setTransactions(( current ) => current.filter(( t ) => t.id !== id));
        },
        []
    );

    const toggleFilters = useCallback(() => {
        setFiltersOpen(( current ) => !current);
    }, []);

    const toggleCategoryFilter = useCallback(( category: string ) => {
        setFilterCategories(( current ) =>
            current.includes(category)
                ? current.filter(( name ) => name !== category)
                : [...current, category]
        );
    }, []);

    const clearFilters = useCallback(() => {
        setFilterType('all');
        setFilterCategories([]);
        setFilterFrom('');
        setFilterTo('');
        setFilterMin('');
        setFilterMax('');
    }, []);

    const distinctCategories = useMemo(
        () =>
            Array.from(new Set(transactions.map(( t ) => t.category))).sort(
                ( a, b ) => a.localeCompare(b)
            ),
        [transactions]
    );

    const filteredTransactions = useMemo(() => {
        const min = parseAmount(filterMin);
        const max = parseAmount(filterMax);

        return transactions.filter(( transaction ) => {
            if (filterType !== 'all' && transaction.type !== filterType) {
                return false;
            }

            if (
                filterCategories.length > 0 &&
                !filterCategories.includes(transaction.category)
            ) {
                return false;
            }

            if (filterFrom && transaction.date < filterFrom) return false;
            if (filterTo && transaction.date > filterTo) return false;

            if (min !== null && transaction.amount < min) return false;
            if (max !== null && transaction.amount > max) return false;

            return true;
        });
    }, [
        transactions,
        filterType,
        filterCategories,
        filterFrom,
        filterTo,
        filterMin,
        filterMax,
    ]);

    const appliedFilterCount = useMemo(
        () =>
            [
                filterType !== 'all',
                filterCategories.length > 0,
                !!filterFrom,
                !!filterTo,
                !!filterMin,
                !!filterMax,
            ].filter(Boolean).length,
        [filterType, filterCategories, filterFrom, filterTo, filterMin, filterMax]
    );

    const totalIncome = useMemo(
        () =>
            transactions
                .filter(( t ) => t.type === 'income')
                .reduce(( total, t ) => total + t.amount, 0),
        [transactions]
    );

    const totalExpense = useMemo(
        () =>
            transactions
                .filter(( t ) => t.type === 'expense')
                .reduce(( total, t ) => total + t.amount, 0),
        [transactions]
    );

    const balance = totalIncome - totalExpense;

    const value: AppContextValue = {
        user,
        logout,

        transactions,
        filteredTransactions,
        loading,
        loadingMore,
        hasMore,
        totalIncome,
        totalExpense,
        balance,
        distinctCategories,

        loadTransactions,
        loadMoreTransactions,
        createTransaction,
        editTransaction,
        removeTransaction,

        filtersOpen,
        toggleFilters,
        filterType,
        setFilterType,
        filterCategories,
        toggleCategoryFilter,
        filterFrom,
        setFilterFrom,
        filterTo,
        setFilterTo,
        filterMin,
        setFilterMin,
        filterMax,
        setFilterMax,
        clearFilters,
        appliedFilterCount,
    };

    return <AppContext.Provider value={ value }>{ children }</AppContext.Provider>;
}


