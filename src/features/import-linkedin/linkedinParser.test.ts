import { describe, expect, it } from 'vitest';
import { parseLinkedinText } from './linkedinParser';

const SAMPLE = `Sobre
Desenvolvedor front-end focado em React e acessibilidade.

Experiência
Desenvolvedor Front-End
Empresa X
jan 2023 - Atual
Criação de interfaces com React.
Manutenção de design system.
Estagiário
Empresa Y
2021 - 2022
Suporte a sistemas internos.

Habilidades
React, TypeScript • SCSS
Vite`;

describe('parseLinkedinText', () => {
  it('extrai o resumo da seção Sobre', () => {
    const draft = parseLinkedinText(SAMPLE);
    expect(draft.summary).toContain('React e acessibilidade');
  });

  it('separa habilidades por vírgula, bullet e quebra de linha', () => {
    const draft = parseLinkedinText(SAMPLE);
    expect(draft.skills).toEqual(['React', 'TypeScript', 'SCSS', 'Vite']);
  });

  it('agrupa experiências com cargo, empresa, período e descrição', () => {
    const { experiences } = parseLinkedinText(SAMPLE);
    expect(experiences).toHaveLength(2);
    expect(experiences[0]).toMatchObject({
      role: 'Desenvolvedor Front-End',
      company: 'Empresa X',
      period: 'jan 2023 - Atual',
    });
    expect(experiences[0].description).toContain('design system');
    expect(experiences[1].role).toBe('Estagiário');
  });

  it('retorna vazio para texto sem seções reconhecidas', () => {
    const draft = parseLinkedinText('texto qualquer');
    expect(draft).toEqual({ summary: '', skills: [], experiences: [] });
  });
});
