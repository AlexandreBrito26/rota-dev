import { describe, expect, it } from 'vitest';
import { emptyResume, getCompleteness, moveItem } from './resumeStore';

describe('getCompleteness', () => {
  it('é 0% para um currículo vazio', () => {
    expect(getCompleteness(emptyResume)).toBe(0);
  });

  it('sobe conforme os itens são preenchidos', () => {
    const partial = {
      ...emptyResume,
      name: 'Ana',
      title: 'Analista',
      email: 'ana@example.com',
    };
    const value = getCompleteness(partial);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);
  });

  it('chega a 100% com todos os itens preenchidos', () => {
    const full = {
      ...emptyResume,
      name: 'Ana',
      title: 'Analista',
      email: 'ana@example.com',
      summary: 'x'.repeat(90),
      skills: ['Excel', 'SQL', 'Power BI'],
      experiences: [{ id: '1', role: 'r', company: 'c', period: 'p', description: 'd' }],
      education: [{ id: '2', course: 'c', institution: 'i', period: 'p' }],
      links: [{ id: '3', label: 'GitHub', url: 'https://github.com/ana' }],
    };
    expect(getCompleteness(full)).toBe(100);
  });
});

describe('moveItem', () => {
  it('troca o item com o anterior ou o seguinte', () => {
    expect(moveItem(['a', 'b', 'c'], 1, -1)).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 1, 1)).toEqual(['a', 'c', 'b']);
  });

  it('não altera a lista nas bordas', () => {
    const list = ['a', 'b'];
    expect(moveItem(list, 0, -1)).toBe(list);
    expect(moveItem(list, 1, 1)).toBe(list);
  });
});
