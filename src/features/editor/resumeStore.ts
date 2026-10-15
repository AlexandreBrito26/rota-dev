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

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
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
  projects: Project[];
  certifications: Certification[];
  links: ResumeLink[];
  github?: string;
  linkedin?: string;
}

interface ResumeState {
  resume: Resume;
  update: (patch: Partial<Resume>) => void;
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
}

export const emptyResume: Resume = {
  name: '',
  title: '',
  email: '',
  summary: '',
  skills: [],
  experiences: [],
  projects: [],
  certifications: [],
  links: [],
};

export const useResumeStore = create<ResumeState>((set) => ({
  resume: emptyResume,
  update: (patch) => set((s) => ({ resume: { ...s.resume, ...patch } })),
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
}));
