import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  period: string;
}

export const LANGUAGE_LEVELS = [
  'Básico',
  'Intermediário',
  'Avançado',
  'Fluente',
  'Nativo',
] as const;

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ResumeLink {
  id: string;
  label: string;
  url: string;
}

export interface Resume {
  name: string;
  title: string;
  email: string;
  summary: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  links: ResumeLink[];
  github?: string;
  linkedin?: string;
}

export const emptyResume: Resume = {
  name: '',
  title: '',
  email: '',
  summary: '',
  skills: [],
  experiences: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  links: [],
};

export const SUMMARY_MAX = 600;

export interface Check {
  label: string;
  done: boolean;
}

/** Itens que um bom currículo costuma ter. Usado no indicador de completude. */
export function getChecklist(resume: Resume): Check[] {
  return [
    { label: 'Nome e cargo', done: Boolean(resume.name.trim() && resume.title.trim()) },
    { label: 'E-mail para contato', done: Boolean(resume.email.trim()) },
    { label: 'Resumo profissional', done: resume.summary.trim().length >= 80 },
    { label: 'Pelo menos 3 habilidades', done: resume.skills.length >= 3 },
    { label: 'Uma experiência', done: resume.experiences.length > 0 },
    { label: 'Formação', done: resume.education.length > 0 },
    { label: 'Um link de portfólio ou GitHub', done: resume.links.some((l) => l.url.trim()) },
  ];
}

export function getCompleteness(resume: Resume): number {
  const checks = getChecklist(resume);
  return Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
}

/** Move um item de uma lista uma posição para cima (-1) ou para baixo (1). */
export function moveItem<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

interface ResumeState {
  resume: Resume;
  update: (patch: Partial<Resume>) => void;
  reset: () => void;
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (index: number, direction: -1 | 1) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: emptyResume,
      update: (patch) => set((s) => ({ resume: { ...s.resume, ...patch } })),
      reset: () => set({ resume: emptyResume }),
      addExperience: () =>
        set((s) => ({
          resume: {
            ...s.resume,
            experiences: [
              ...s.resume.experiences,
              { id: crypto.randomUUID(), role: '', company: '', period: '', description: '' },
            ],
          },
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experiences: s.resume.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          resume: { ...s.resume, experiences: s.resume.experiences.filter((e) => e.id !== id) },
        })),
      moveExperience: (index, direction) =>
        set((s) => ({
          resume: { ...s.resume, experiences: moveItem(s.resume.experiences, index, direction) },
        })),
    }),
    {
      name: 'rota-dev:resume',
      partialize: (state) => ({ resume: state.resume }),
      // Dados salvos antes de novos campos existirem recebem os valores padrão.
      merge: (persisted, current) => {
        const saved = (persisted as { resume?: Partial<Resume> } | undefined)?.resume;
        return { ...current, resume: { ...emptyResume, ...saved } };
      },
    },
  ),
);
