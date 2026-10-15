import { create } from 'zustand';

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

export interface Resume {
  name: string;
  title: string;
  email: string;
  summary: string;
  skills: string[];
  experiences: Experience[];
  projects: Project[];
  github?: string;
  linkedin?: string;
}

interface ResumeState {
  resume: Resume;
  update: (patch: Partial<Resume>) => void;
}

export const emptyResume: Resume = {
  name: '',
  title: 'Desenvolvedor Front-End',
  email: '',
  summary: '',
  skills: [],
  experiences: [],
  projects: [],
};

export const useResumeStore = create<ResumeState>((set) => ({
  resume: emptyResume,
  update: (patch) => set((s) => ({ resume: { ...s.resume, ...patch } })),
}));
