import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    updateDoc,
    type DocumentSnapshot,
} from 'firebase/firestore';

import { auth, db } from './firebase';
import type { Transaction } from '@/src/interfaces';

const PAGE_SIZE = 20;

export type TransactionInput = Omit<Transaction, 'id'>;

export interface TransactionsPage {
    transactions: Transaction[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
}

function requireUid(): string {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    return user.uid;
}

const transactionsCollection = () => collection(db, 'users', requireUid(), 'transactions');

const transactionDoc = (transactionId: string) => doc(transactionsCollection(), transactionId);

export async function addTransaction(transaction: TransactionInput): Promise<Transaction> {
    const docRef = await addDoc(transactionsCollection(), {
        ...transaction,
        createdAt: Timestamp.now(),
    });

    return { id: docRef.id, ...transaction };
}

export async function getTransactions(lastDoc?: DocumentSnapshot | null): Promise<TransactionsPage> {
    const q = query(
        transactionsCollection(),
        orderBy('date', 'desc'),
        limit(PAGE_SIZE),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
    );

    const snapshot = await getDocs(q);

    return {
        transactions: snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as TransactionInput),
        })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
        hasMore: snapshot.docs.length === PAGE_SIZE,
    };
}

/** Sem `receipt`, o comprovante salvo no servidor é mantido. */
export type TransactionUpdate = Omit<TransactionInput, 'receipt'> & Partial<Pick<TransactionInput, 'receipt'>>;

export async function updateTransaction(
    transactionId: string,
    transaction: TransactionUpdate,
): Promise<void> {
    await updateDoc(transactionDoc(transactionId), { ...transaction });
}

export async function deleteTransaction(transactionId: string): Promise<void> {
    await deleteDoc(transactionDoc(transactionId));
}
