import { useThemeStore } from './themeStore';

export function ThemeToggle() {
  const resolved = useThemeStore((s) => s.resolved);
  const setMode = useThemeStore((s) => s.setMode);
  const next = resolved === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={`Ativar tema ${next === 'dark' ? 'noturno' : 'diurno'}`}
      style={{
        padding: '0.4rem 0.9rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        cursor: 'pointer',
      }}
    >
      {resolved === 'dark' ? '☀️ Dia' : '🌙 Noite'}
    </button>
  );
}
