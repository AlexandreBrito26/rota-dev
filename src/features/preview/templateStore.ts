import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FontId, PaletteId, TemplateId } from './styleConfig';

interface StyleState {
  template: TemplateId;
  palette: PaletteId;
  font: FontId;
  setTemplate: (template: TemplateId) => void;
  setPalette: (palette: PaletteId) => void;
  setFont: (font: FontId) => void;
}

export const useTemplateStore = create<StyleState>()(
  persist(
    (set) => ({
      template: 'clean',
      palette: 'rota',
      font: 'sans',
      setTemplate: (template) => set({ template }),
      setPalette: (palette) => set({ palette }),
      setFont: (font) => set({ font }),
    }),
    { name: 'rota-dev:style' },
  ),
);
