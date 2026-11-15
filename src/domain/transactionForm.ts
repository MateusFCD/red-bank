import type {
    Transaction,
    TransactionFormErrors,
    TransactionFormState,
} from '@/src/interfaces';
import { formatAmountInput, parseAmount, todayIso } from '@/src/utils/format';

export function createEmptyTransactionForm(): TransactionFormState {
    return {
        desc: '',
        amount: '',
        type: 'expense',
        category: '',
        date: todayIso(),
        receipt: null,
        receiptName: '',
    };
}

export function transactionToForm(transaction: Transaction): TransactionFormState {
    return {
        desc: transaction.desc,
        amount: formatAmountInput(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        receipt: transaction.receipt,
        receiptName: '',
    };
}

export function validateTransactionForm(form: TransactionFormState): TransactionFormErrors {
    const errors: TransactionFormErrors = {};

    if (!form.desc.trim()) errors.desc = 'Informe uma descrição.';

    const amount = parseAmount(form.amount);
    if (!form.amount.trim()) {
        errors.amount = 'Informe um valor.';
    } else if (amount === null || amount <= 0) {
        errors.amount = 'Informe um valor válido.';
    }

    if (!form.category) errors.category = 'Selecione uma categoria.';
    if (!form.date.trim()) errors.date = 'Informe uma data.';

    return errors;
}

/** Converte o estado do formulário (já validado) no payload persistido. */
export function formToTransaction(form: TransactionFormState): Omit<Transaction, 'id'> {
    return {
        desc: form.desc.trim(),
        amount: parseAmount(form.amount) ?? 0,
        type: form.type,
        category: form.category,
        date: form.date,
        receipt: form.receipt,
    };
}
