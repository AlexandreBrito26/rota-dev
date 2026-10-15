const API = 'https://api.github.com';

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
}

export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  html_url: string;
}

export class GithubError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/**
 * Token opcional (sem ele o limite é baixo, ~60 req/h por IP).
 * Definir em .env.local como VITE_GITHUB_TOKEN. Nunca commitar.
 */
const headers = (): HeadersInit => {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers(), signal });
  if (res.status === 404) throw new GithubError('Usuário não encontrado.', 404);
  if (res.status === 403) throw new GithubError('Limite da API do GitHub atingido. Tente mais tarde.', 403);
  if (!res.ok) throw new GithubError('Falha ao consultar o GitHub.', res.status);
  return res.json() as Promise<T>;
}

export const fetchProfile = (user: string, signal?: AbortSignal) =>
  get<GithubProfile>(`/users/${encodeURIComponent(user)}`, signal);

export const fetchRepos = (user: string, signal?: AbortSignal) =>
  get<GithubRepo[]>(
    `/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=30`,
    signal,
  );
