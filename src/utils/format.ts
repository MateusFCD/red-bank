export function money( n: number ): string {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseIsoDate( iso: string ): Date {
    return new Date(`${ iso }T00:00:00`);
}

export function formatDateShort( iso: string ): string {
    return parseIsoDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function formatDateFull( iso: string ): string {
    return parseIsoDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function todayIso(): string {
    return dateToIso(new Date());
}

export function dateToIso( date: Date ): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${ y }-${ m }-${ d }`;
}
