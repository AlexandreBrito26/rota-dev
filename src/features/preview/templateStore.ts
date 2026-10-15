import { create } from 'zustand';

export const TEMPLATES = [
  { id: 'clean', label: 'Clássico' },
  { id: 'bold', label: 'Destaque' },
  { id: 'minimal', label: 'Minimalista' },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]['id'];

interface TemplateState {
  template: TemplateId;
  setTemplate: (template: TemplateId) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  template: 'clean',
  setTemplate: (template) => set({ template }),
}));
