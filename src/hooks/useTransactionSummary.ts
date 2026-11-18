import { useMemo } from 'react';

import { summarizeTransactions } from '@/src/domain/transactions';
import type { Transaction } from '@/src/interfaces';

export function useTransactionSummary(transactions: Transaction[]) {
    return useMemo(() => summarizeTransactions(transactions), [transactions]);
}
