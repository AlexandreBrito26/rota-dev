import type { CSSProperties } from 'react';

export const TEMPLATES = [
  { id: 'clean', label: 'Clássico' },
  { id: 'bold', label: 'Destaque' },
  { id: 'minimal', label: 'Minimalista' },
  { id: 'executive', label: 'Executivo' },
  { id: 'ats', label: 'ATS (RH)' },
] as const;

export const PALETTES = [
  { id: 'rota', label: 'Rota', accent: '#0f766e', accent2: '#d97706' },
  { id: 'oceano', label: 'Oceano', accent: '#1d4ed8', accent2: '#0ea5e9' },
  { id: 'floresta', label: 'Floresta', accent: '#15803d', accent2: '#84cc16' },
  { id: 'lavanda', label: 'Lavanda', accent: '#7c3aed', accent2: '#db2777' },
  { id: 'por-do-sol', label: 'Pôr do sol', accent: '#ea580c', accent2: '#e11d48' },
  { id: 'terra', label: 'Terra', accent: '#92400e', accent2: '#a16207' },
  { id: 'grafite', label: 'Grafite', accent: '#27272a', accent2: '#71717a' },
  { id: 'ardosia', label: 'Ardósia', accent: '#334155', accent2: '#64748b' },
] as const;

export const FONTS = [
  { id: 'sans', label: 'Moderna', value: "'Inter', system-ui, sans-serif" },
  { id: 'serif', label: 'Clássica', value: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', label: 'Técnica', value: "'JetBrains Mono', ui-monospace, monospace" },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]['id'];
export type PaletteId = (typeof PALETTES)[number]['id'];
export type FontId = (typeof FONTS)[number]['id'];

/**
 * Estilo aplicado ao currículo. O modelo ATS ignora cores e fonte de propósito:
 * sistemas de triagem leem melhor texto simples e preto no branco.
 */
export function buildResumeStyle(template: TemplateId, paletteId: PaletteId, fontId: FontId): CSSProperties {
  if (template === 'ats') {
    return { fontFamily: 'Arial, Helvetica, sans-serif' };
  }
  const font = FONTS.find((f) => f.id === fontId) ?? FONTS[0];
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  return {
    fontFamily: font.value,
    '--color-accent': palette.accent,
    '--color-accent-2': palette.accent2,
    '--color-route': palette.accent,
  } as CSSProperties;
}
