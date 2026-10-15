import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  resolved: Resolved;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'rota-dev:theme';

const systemPrefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

/** Função pura: resolve o modo escolhido para dia ou noite. */
export const resolveTheme = (mode: ThemeMode, prefersDark: boolean): Resolved =>
  mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

const resolve = (mode: ThemeMode): Resolved => resolveTheme(mode, systemPrefersDark());

const storedMode = (): ThemeMode => {
  const value = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
};

export const useThemeStore = create<ThemeState>((set) => {
  const initial = storedMode();
  return {
    mode: initial,
    resolved: resolve(initial),
    setMode: (mode) => {
      localStorage.setItem(STORAGE_KEY, mode);
      set({ mode, resolved: resolve(mode) });
    },
  };
});
