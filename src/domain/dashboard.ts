import type { Transaction } from '@/src/interfaces';
import type { TransactionSummary } from '@/src/domain/transactions';

export interface CategorySummary {
    name: string;
    percentage: number;
    amount: number;
    color: string;
}

export interface FinancialSummaryItem {
    label: string;
    value: number;
    color: string;
}

export const MONTHS = [
    { label: 'Janeiro', value: 1 },
    { label: 'Fevereiro', value: 2 },
    { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Maio', value: 5 },
    { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 },
    { label: 'Novembro', value: 11 },
    { label: 'Dezembro', value: 12 },
] as const;

const CHART_CATEGORY_COLORS: Record<string, string> = {
    Alimentação: '#F2EEEE',
    Transporte: '#FF3B1F',
    Moradia: '#D4D0D0',
    Saúde: '#FF9482',
    Lazer: '#E52F19',
    Compras: '#F4C1B8',
    Educação: '#9E9A9A',
    Salário: '#B8B4B4',
    Outros: '#c0210f',
};

const round2 = (value: number) => Number(value.toFixed(2));

export function getMonthLabel(month: number): string {
    return MONTHS.find((m) => m.value === month)?.label ?? 'Selecione';
}

export function getExpensesByCategory(transactions: Transaction[]): CategorySummary[] {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    const byCategory: Record<string, number> = {};
    expenses.forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

    return Object.entries(byCategory).map(([name, amount]) => ({
        name,
        amount: round2(amount),
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        color: CHART_CATEGORY_COLORS[name] || '#CCCCCC',
    }));
}

export function getFinancialOverview({
    totalIncome,
    totalExpense,
    balance,
}: TransactionSummary): FinancialSummaryItem[] {
    return [
        { label: 'Entradas', value: round2(totalIncome), color: '#22c55e' },
        { label: 'Gastos', value: round2(totalExpense), color: '#f97316' },
        { label: 'Saldo', value: round2(balance), color: balance < 0 ? '#FF3B1F' : '#7edfaa' },
    ];
}

export function getAnalysisMessage(balance: number): string {
    if (balance > 200) {
        return 'Seus gastos estão sob controle e você conseguiu uma excelente margem de sobra neste mês. Continue assim!';
    }
    if (balance >= 0) {
        return 'Você fechou o mês no azul, mas com uma margem bem justa. Vale a pena ficar de olho nos próximos gastos.';
    }
    return 'Atenção: seus gastos superaram suas entradas neste mês e você ficou no vermelho. Reveja o orçamento para recuperar o saldo.';
}
