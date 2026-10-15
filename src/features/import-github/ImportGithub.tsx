import { useState } from 'react';
import { fetchProfile, fetchRepos, GithubError } from '@/services/githubClient';
import { pickHighlights, topLanguages } from './githubMapper';
import { useResumeStore } from '@/features/editor/resumeStore';
import { toast } from '@/shared/toast/toastStore';
import styles from './ImportGithub.module.scss';

export function ImportGithub() {
  const update = useResumeStore((s) => s.update);
  const [user, setUser] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    const username = user.trim();
    if (!username || status === 'loading') return;
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
      toast.success(`Importados ${highlights.length} destaques e ${langs.length} linguagens.`);
    } catch (err) {
      setError(err instanceof GithubError ? err.message : 'Erro inesperado ao importar.');
    } finally {
      setStatus('idle');
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="github-title">
      <h2 id="github-title" className={styles.title}>Importar do GitHub</h2>
      <p className={styles.hint}>Puxa seu nome, bio, linguagens e repositórios em destaque.</p>
      <form
        className={styles.row}
        onSubmit={(e) => {
          e.preventDefault();
          handleImport();
        }}
      >
        <input
          aria-label="Usuário do GitHub"
          placeholder="ex.: octocat"
          value={user}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
        />
        <button type="submit" disabled={status === 'loading' || !user.trim()}>
          {status === 'loading' ? 'Buscando…' : 'Importar'}
        </button>
      </form>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
