import type { GithubRepo } from '@/services/githubClient';

export interface RepoSummary {
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
}

/** Remove forks e repositórios sem descrição de destaque, ordena por estrelas. */
export function pickHighlights(repos: GithubRepo[], limit = 6): RepoSummary[] {
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description ?? '',
      language: r.language,
      stars: r.stargazers_count,
    }));
}

/** Linguagens mais usadas entre os repositórios, em ordem de frequência. */
export function topLanguages(repos: GithubRepo[], limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([lang]) => lang);
}
