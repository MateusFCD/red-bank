export type TransactionType = 'income' | 'expense';

export interface Category {
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: TransactionType;
  category: string;
  /** ISO date, e.g. "2026-08-02". */
  date: string;
  receipt: string | null;
}

export interface AuthForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface TransactionFormState {
  desc: string;
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
  receipt: string | null;
  receiptName: string;
}

export interface TransactionFormErrors {
  desc?: string;
  amount?: string;
  category?: string;
  date?: string;
}

export type FilterType = 'all' | TransactionType;
