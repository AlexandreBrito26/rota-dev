import { describe, expect, it } from 'vitest';
import { resolveTheme } from './themeStore';

describe('resolveTheme', () => {
  it('usa o modo explícito, ignorando o sistema', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('segue a preferência do sistema quando o modo é system', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });
});
