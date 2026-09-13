export const CATEGORIES = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Lazer',
    'Compras',
    'Educação',
    'Salário',
    'Outros',
] as const;

const CATEGORY_COLORS: Record<string, string> = {
    'Alimentação': '#FF9783',
    'Transporte': '#4D96FF',
    'Moradia': '#A66DD4',
    'Saúde': '#6BCB77',
    'Lazer': '#FFD93D',
    'Compras': '#FF6F91',
    'Educação': '#2E86AB',
    'Salário': '#65D39A',
    'Outros': '#9B9797',
};

const FALLBACK_PALETTE = [
    '#EC3013', '#FF9783', '#4D96FF', '#6BCB77',
    '#FFD93D', '#A66DD4', '#FF6F91', '#2E86AB',
];

/** Deterministic color for a category chip, falling back to a hash-based pick for unknown names. */
export function catColor(name: string): string {
    if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}
