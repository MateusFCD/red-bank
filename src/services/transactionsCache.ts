import { clearEncryptedCache, readEncrypted, writeEncrypted } from '@/src/infra/storage/encryptedCache';
import type { Transaction } from '@/src/interfaces';

const NAMESPACE = 'transactions';

/** Quantidade máxima de transações guardadas no aparelho. */
const MAX_CACHED = 100;

/** Depois desse prazo o cache é descartado, limitando a exposição dos dados no aparelho. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type CachedTransaction = Omit<Transaction, 'receipt'> & { hasReceipt: boolean };

export interface CachedTransactions {
    transactions: Transaction[];
    /** Ids cujo comprovante existe no servidor mas não foi guardado no cache. */
    omittedReceiptIds: Set<string>;
}

export async function loadCachedTransactions(uid: string): Promise<CachedTransactions | null> {
    const cached = await readEncrypted<CachedTransaction[]>(NAMESPACE, uid, MAX_AGE_MS);
    if (!cached) return null;

    const omittedReceiptIds = new Set<string>();
    const transactions = cached.map(({ hasReceipt, ...transaction }) => {
        if (hasReceipt) omittedReceiptIds.add(transaction.id);
        return { ...transaction, receipt: null };
    });

    return { transactions, omittedReceiptIds };
}

export function saveCachedTransactions(uid: string, transactions: Transaction[]): Promise<void> {
    // Os comprovantes são imagens base64 grandes: guardá-los estouraria o limite
    // do AsyncStorage. A lista vinda do servidor os repõe assim que carrega.
    const slim: CachedTransaction[] = transactions
        .slice(0, MAX_CACHED)
        .map(({ receipt, ...transaction }) => ({ ...transaction, hasReceipt: !!receipt }));

    return writeEncrypted(NAMESPACE, uid, slim);
}

export function clearUserCache(uid: string): Promise<void> {
    return clearEncryptedCache(uid);
}
