import { useEffect } from 'react';
import { useThemeStore } from './themeStore';

/** Aplica o tema resolvido no <html data-theme> e acompanha mudanças do sistema. */
export function useTheme() {
  const { mode, resolved, setMode } = useThemeStore();

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  useEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setMode('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode, setMode]);
}
