export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseIsoDate(iso: string): Date {
    return new Date(`${iso}T12:00:00`);
}

export function formatDateShort(iso: string): string {
    return parseIsoDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function formatDateFull(iso: string): string {
    return parseIsoDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function isoToDate(iso: string): Date {
    return iso ? parseIsoDate(iso) : new Date();
}

export function todayIso(): string {
    return dateToIso(new Date());
}

export function dateToIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function formatDateDisplay(date: string): string {
    if (!date) return '';

    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
}

/** Converte um texto no formato "1.234,56" em número, ou null quando vazio/inválido. */
export function parseAmount(value: string): number | null {
    if (!value.trim()) return null;

    const normalized = value.replace(/\./g, '').replace(',', '.');
    const amount = Number(normalized);

    return Number.isNaN(amount) ? null : amount;
}

/** Converte um número no texto editável usado nos inputs de valor ("12,5"). */
export function formatAmountInput(value: number): string {
    return value.toString().replace('.', ',');
}

export function getFirstName(fullName?: string | null): string {
    return fullName?.trim().split(' ')[0] ?? '';
}
