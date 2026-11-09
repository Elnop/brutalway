import { repositoryTreeUrl } from '@/features/docs/lib/docsUrls.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFile(value: unknown): value is { type: 'blob'; path: string } {
  return isRecord(value) && value['type'] === 'blob' && typeof value['path'] === 'string';
}

export async function listRepositoryFiles(repo: string, signal: AbortSignal): Promise<string[] | undefined> {
  try {
    const response = await fetch(repositoryTreeUrl(repo), { signal });
    if (!response.ok) return undefined;
    const tree: unknown = await response.json();
    if (!isRecord(tree) || tree['truncated'] === true || !Array.isArray(tree['tree'])) return undefined;
    return tree['tree'].filter(isFile).map((item) => item.path);
  } catch {
    return undefined;
  }
}

export async function fetchDocText(url: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, { signal }).catch(() => {
    throw new Error('The page could not be loaded from GitHub.');
  });
  if (!response.ok) throw new Error(`GitHub answered ${String(response.status)}.`);
  return response.text();
}
