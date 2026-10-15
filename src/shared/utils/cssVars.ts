/** Lê o valor atual de um token CSS (útil para o canvas, que não usa var()). */
export function readToken(name: string, fallback = '#000'): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
