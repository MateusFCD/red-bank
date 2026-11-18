import type { Transaction, TransactionType } from '@/src/interfaces';

export interface TransactionSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

function sumByType(transactions: Transaction[], type: TransactionType): number {
    return transactions
        .filter((t) => t.type === type)
        .reduce((total, t) => total + t.amount, 0);
}

export function summarizeTransactions(transactions: Transaction[]): TransactionSummary {
    const totalIncome = sumByType(transactions, 'income');
    const totalExpense = sumByType(transactions, 'expense');

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}

export function getDistinctCategories(transactions: Transaction[]): string[] {
    return Array.from(new Set(transactions.map((t) => t.category))).sort((a, b) =>
        a.localeCompare(b),
    );
}

export function filterTransactionsByMonth(
    transactions: Transaction[],
    year: number,
    month: number,
): Transaction[] {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return transactions.filter((t) => t.date.startsWith(prefix));
}
