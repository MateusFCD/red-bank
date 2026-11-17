import { useMemo, useState } from 'react';

import {
    getExpensesByCategory,
    getFinancialOverview,
} from '@/src/domain/dashboard';
import { filterTransactionsByMonth, summarizeTransactions } from '@/src/domain/transactions';
import { useTransactions } from '@/src/hooks/useTransactions';

/** Dados agregados do mês selecionado para o Dashboard. */
export function useMonthlyReport() {
    const { transactions } = useTransactions();

    const now = new Date();
    const [year] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);

    return useMemo(() => {
        const monthTransactions = filterTransactionsByMonth(transactions, year, month);
        const summary = summarizeTransactions(monthTransactions);

        return {
            month,
            setMonth,
            summary,
            categories: getExpensesByCategory(monthTransactions),
            overview: getFinancialOverview(summary),
        };
    }, [transactions, year, month]);
}
