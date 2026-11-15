import { TransactionsContext } from '@/src/context/TransactionsContext';
import { createContextHook } from '@/src/hooks/createContextHook';

export const useTransactions = createContextHook(TransactionsContext, 'useTransactions');
