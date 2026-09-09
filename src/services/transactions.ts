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
    type DocumentSnapshot,
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

export async function getTransactions(
    lastDoc?: DocumentSnapshot,
) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('Usuário não autenticado.');
    }

    const constraints = [
        orderBy('date', 'desc'),
        limit(20),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
    ];

    const q = query(
        transactionsCollection(user.uid),
        ...constraints,
    );

    const snapshot = await getDocs(q);

    const transactions: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, 'id'>),
    }));

    return {
        transactions,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
        hasMore: snapshot.docs.length === 20,
    };
}

export async function deleteTransaction(transactionId: string) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const transactionRef = collection(
        db,
        "users",
        user.uid,
        "transactions"
    );

    await deleteDoc(
        doc(transactionRef, transactionId)
    );
}