import { useState } from 'react';
import { fetchProfile, fetchRepos, GithubError } from '@/services/githubClient';
import { pickHighlights, topLanguages } from './githubMapper';
import { useResumeStore } from '@/features/editor/resumeStore';
import styles from './ImportGithub.module.scss';

export function ImportGithub() {
  const update = useResumeStore((s) => s.update);
  const [user, setUser] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ langs: string[]; count: number } | null>(null);

  async function handleImport() {
    const username = user.trim();
    if (!username) return;
    setStatus('loading');
    setError(null);
    try {
      const [profile, repos] = await Promise.all([fetchProfile(username), fetchRepos(username)]);
      const highlights = pickHighlights(repos);
      const langs = topLanguages(repos);

      update({
        github: profile.html_url,
        skills: langs,
        projects: highlights,
        summary: profile.bio ?? '',
        name: profile.name ?? profile.login,
      });
      setPreview({ langs, count: highlights.length });
      setStatus('done');
    } catch (err) {
      setError(err instanceof GithubError ? err.message : 'Erro inesperado ao importar.');
      setStatus('idle');
    }
  }

  return (
    <section className={styles.panel} aria-label="Importar do GitHub">
      <h2 className={styles.title}>Importar do GitHub</h2>
      <div className={styles.row}>
        <input
          placeholder="usuário do GitHub"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleImport()}
        />
        <button type="button" onClick={handleImport} disabled={status === 'loading'}>
          {status === 'loading' ? 'Buscando…' : 'Importar'}
        </button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {status === 'done' && preview && (
        <p className={styles.success}>
          Importados {preview.count} destaques e {preview.langs.length} linguagens.
        </p>
      )}
    </section>
  );
}
