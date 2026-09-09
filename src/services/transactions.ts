import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from 'firebase/firestore';

import { auth, db } from './firebase';
import type { Transaction } from '@/src/interfaces';

const transactionsCollection = (uid: string) =>
    collection(db, 'users', uid, 'transactions');

export async function addTransaction(
    transaction: Omit<Transaction, 'id'>
) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    const docRef = await addDoc(transactionsCollection(user.uid), {
        ...transaction,
        createdAt: Timestamp.now(),
    });

    return {
        id: docRef.id,
        ...transaction,
    };
}

export async function getTransactions(): Promise<Transaction[]> {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    const q = query(
        transactionsCollection(user.uid),
        orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, 'id'>),
    }));
}