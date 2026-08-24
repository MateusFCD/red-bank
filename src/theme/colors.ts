/**
 * Design tokens for the Fluxo screens, carried over from the Claude Design
 * "Modernist" system (styles.css) with the dark surface overrides the
 * `Fluxo Banco.dc.html` prototype applies to its phone frame.
 */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

/** Mirrors CSS `color-mix(in srgb, <hex> <pct>%, transparent)`. */
export function withAlpha(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${pct})`;
}

export const colors = {
  bg: '#121110',
  surface: '#1c1a19',
  text: '#f5f3f0',
  divider: withAlpha('#f5f3f0', 0.14),

  accent: '#ec3013',
  accent100: '#fff2ef',
  accent200: '#ffe0d9',
  accent300: '#ffc4b8',
  accent400: '#ff9783',
  accent500: '#ff563c',
  accent600: '#dd2b0f',
  accent700: '#ae1800',
  accent800: '#7c1405',
  accent900: '#4d170e',

  neutral100: '#f8f4f4',
  neutral200: '#eae7e7',
  neutral300: '#d7d3d3',
  neutral400: '#bab6b6',
  neutral500: '#9b9797',
  neutral600: '#7d7979',
  neutral700: '#605d5d',
  neutral800: '#444141',
  neutral900: '#2d2b2b',
} as const;

export const textMuted = (pct: number) => withAlpha(colors.text, pct);

export const radius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
} as const;

export const fonts = {
  heading: 'Archivo_800ExtraBold',
  body: 'Archivo_400Regular',
  bodyMedium: 'Archivo_600SemiBold',
} as const;
