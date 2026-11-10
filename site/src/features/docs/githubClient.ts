import type { RoadmapIssue } from '@/features/docs/DocsTypes.ts';
import { issuesUrl, repositoryTreeUrl } from '@/features/docs/lib/githubUrls.ts';
import { isRecord } from '@/features/docs/lib/isRecord.ts';
import { roadmapIssue } from '@/features/docs/lib/roadmapIssue.ts';

function isFile(value: unknown): value is { type: 'blob'; path: string } {
  return isRecord(value) && value['type'] === 'blob' && typeof value['path'] === 'string';
}

export async function listRepositoryFiles(
  repo: string,
  signal: AbortSignal,
): Promise<string[] | undefined> {
  try {
    const response = await fetch(repositoryTreeUrl(repo), { signal });
    if (!response.ok) return undefined;
    const tree: unknown = await response.json();
    if (!isRecord(tree) || tree['truncated'] === true || !Array.isArray(tree['tree'])) {
      return undefined;
    }
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

const ISSUES_PER_PAGE = 100;

async function issuePage(repo: string, page: number, signal: AbortSignal): Promise<unknown[]> {
  const response = await fetch(issuesUrl(repo, page), { signal }).catch(() => {
    throw new Error('The issues could not be loaded from GitHub.');
  });
  if (!response.ok) throw new Error(`GitHub answered ${String(response.status)}.`);
  const items: unknown = await response.json();
  if (!Array.isArray(items)) {
    throw new Error('GitHub answered with something other than a list of issues.');
  }
  return items.length < ISSUES_PER_PAGE
    ? items
    : [...items, ...(await issuePage(repo, page + 1, signal))];
}

export async function listIssues(repo: string, signal: AbortSignal): Promise<RoadmapIssue[]> {
  return (await issuePage(repo, 1, signal)).flatMap(roadmapIssue);
}
