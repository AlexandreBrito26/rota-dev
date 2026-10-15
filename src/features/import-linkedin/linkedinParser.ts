import type { Experience } from '@/features/editor/resumeStore';

export interface LinkedinDraft {
  summary: string;
  skills: string[];
  experiences: Experience[];
}

type Section = 'summary' | 'experience' | 'skills' | 'ignore';

// Cabeçalhos comuns no export do LinkedIn, em português e inglês.
const HEADERS: Record<string, Section> = {
  sobre: 'summary',
  resumo: 'summary',
  about: 'summary',
  summary: 'summary',
  experiência: 'experience',
  experiencia: 'experience',
  experience: 'experience',
  habilidades: 'skills',
  skills: 'skills',
  formação: 'ignore',
  educação: 'ignore',
  education: 'ignore',
  certificações: 'ignore',
  certifications: 'ignore',
};

const normalize = (line: string) => line.trim().toLowerCase();

/**
 * Converte texto colado do LinkedIn em rascunho de currículo.
 * Heurístico por design: o resultado sempre passa por revisão do usuário.
 */
export function parseLinkedinText(text: string): LinkedinDraft {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd());
  const buckets: Record<Section, string[]> = {
    summary: [],
    experience: [],
    skills: [],
    ignore: [],
  };

  let current: Section = 'ignore';
  for (const line of lines) {
    const key = normalize(line);
    if (key in HEADERS) {
      current = HEADERS[key];
      continue;
    }
    if (line.trim()) buckets[current].push(line.trim());
  }

  return {
    summary: buckets.summary.join(' '),
    skills: buckets.skills
      .flatMap((l) => l.split(/[,•·]/))
      .map((s) => s.trim())
      .filter(Boolean),
    experiences: parseExperiences(buckets.experience),
  };
}

/**
 * Cada experiência costuma ocupar 3 linhas: cargo, empresa e período.
 * Linhas seguintes até a próxima experiência viram descrição.
 */
function parseExperiences(lines: string[]): Experience[] {
  const result: Experience[] = [];
  let i = 0;
  while (i < lines.length) {
    const role = lines[i];
    const company = lines[i + 1] ?? '';
    const period = lines[i + 2] ?? '';
    const description: string[] = [];
    i += 3;
    while (i < lines.length && !looksLikeRole(lines[i], lines[i + 2])) {
      description.push(lines[i]);
      i++;
    }
    result.push({
      id: crypto.randomUUID(),
      role,
      company,
      period,
      description: description.join(' '),
    });
  }
  return result;
}

const PERIOD = /\d{4}|present|atual/i;

// Uma linha inicia nova experiência quando a seguinte traz um período e ela mesma não traz.
const looksLikeRole = (line: string | undefined, next: string | undefined) =>
  !!line && !!next && PERIOD.test(next) && !PERIOD.test(line);
