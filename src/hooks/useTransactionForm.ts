import { useEffect, useState } from 'react';

import {
    createEmptyTransactionForm,
    formToTransaction,
    transactionToForm,
    validateTransactionForm,
} from '@/src/domain/transactionForm';
import { useTransactions } from '@/src/hooks/useTransactions';
import type { Transaction, TransactionFormErrors, TransactionFormState } from '@/src/interfaces';

/** Estado, validação e submissão do formulário de criar/editar transação. */
export function useTransactionForm(transaction?: Transaction) {
    const isEditing = !!transaction;
    const { createTransaction, editTransaction } = useTransactions();

    const [form, setForm] = useState<TransactionFormState>(createEmptyTransactionForm);
    const [errors, setErrors] = useState<TransactionFormErrors>({});
    const [saving, setSaving] = useState(false);

    function reset(source?: Transaction) {
        setForm(source ? transactionToForm(source) : createEmptyTransactionForm());
        setErrors({});
    }

    // A tela pode continuar montada entre navegações: sincroniza com o parâmetro da rota.
    useEffect(() => reset(transaction), [transaction]);

    function updateField<K extends keyof TransactionFormState>(
        field: K,
        value: TransactionFormState[K],
    ) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    }

    /** Retorna `true` quando a transação foi salva com sucesso. */
    async function submit(): Promise<boolean> {
        const validationErrors = validateTransactionForm(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return false;

        try {
            setSaving(true);

            const payload = formToTransaction(form);

            if (transaction) {
                await editTransaction(transaction.id, payload);
            } else {
                await createTransaction(payload);
            }

            reset();
            return true;
        } catch {
            setErrors({
                desc: isEditing
                    ? 'Não foi possível atualizar a transação.'
                    : 'Não foi possível salvar a transação.',
            });
            return false;
        } finally {
            setSaving(false);
        }
    }

    return { form, errors, saving, isEditing, updateField, submit };
}
