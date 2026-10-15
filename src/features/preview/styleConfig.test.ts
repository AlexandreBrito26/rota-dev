import { describe, expect, it } from 'vitest';
import { buildResumeStyle } from './styleConfig';

describe('buildResumeStyle', () => {
  it('aplica a paleta escolhida nas variáveis de cor', () => {
    const style = buildResumeStyle('clean', 'oceano', 'sans') as Record<string, string>;
    expect(style['--color-accent']).toBe('#1d4ed8');
    expect(style['--color-accent-2']).toBe('#0ea5e9');
  });

  it('usa fonte serifada quando escolhida', () => {
    const style = buildResumeStyle('minimal', 'rota', 'serif');
    expect(style.fontFamily).toContain('Georgia');
  });

  it('modelo ATS não recebe cores nem fonte decorativa', () => {
    const style = buildResumeStyle('ats', 'lavanda', 'mono') as Record<string, string>;
    expect(style['--color-accent']).toBeUndefined();
    expect(style.fontFamily).toBe('Arial, Helvetica, sans-serif');
  });

  it('cai na paleta padrão quando o id é desconhecido', () => {
    const style = buildResumeStyle('bold', 'inexistente' as never, 'sans') as Record<string, string>;
    expect(style['--color-accent']).toBe('#0f766e');
  });
});
