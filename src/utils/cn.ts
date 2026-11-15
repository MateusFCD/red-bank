/** Junta classes Tailwind ignorando valores falsy (false, null, undefined, ''). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
