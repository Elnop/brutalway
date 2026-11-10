import type { RoadmapIssue } from '@/features/docs/DocsTypes.ts';
import { issuesUrl, repositoryTreeUrl } from '@/features/docs/lib/docsUrls.ts';

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

const ISSUES_PER_PAGE = 100;

function labelName(value: unknown): string[] {
  return isRecord(value) && typeof value['name'] === 'string' ? [value['name']] : [];
}

function parentNumber(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined;
  const number = Number(value.slice(value.lastIndexOf('/') + 1));
  return Number.isInteger(number) ? number : undefined;
}

function issueStatus(value: Record<string, unknown>): Pick<RoadmapIssue, 'closed' | 'completed' | 'labels' | 'parent'> {
  const labels = value['labels'];
  return {
    closed: value['state'] === 'closed',
    completed: value['state_reason'] === 'completed',
    labels: Array.isArray(labels) ? labels.flatMap(labelName) : [],
    parent: parentNumber(value['parent_issue_url']),
  };
}

function roadmapIssue(value: unknown): RoadmapIssue[] {
  if (!isRecord(value) || value['pull_request'] !== undefined) return [];
  const { number, title, html_url: url } = value;
  if (typeof number !== 'number' || typeof title !== 'string' || typeof url !== 'string') return [];
  return [{ number, title, url, ...issueStatus(value) }];
}

async function issuePage(repo: string, page: number, signal: AbortSignal): Promise<unknown[]> {
  const response = await fetch(issuesUrl(repo, page), { signal }).catch(() => {
    throw new Error('The issues could not be loaded from GitHub.');
  });
  if (!response.ok) throw new Error(`GitHub answered ${String(response.status)}.`);
  const items: unknown = await response.json();
  if (!Array.isArray(items)) throw new Error('GitHub answered with something other than a list of issues.');
  return items.length < ISSUES_PER_PAGE ? items : [...items, ...(await issuePage(repo, page + 1, signal))];
}

export async function listIssues(repo: string, signal: AbortSignal): Promise<RoadmapIssue[]> {
  return (await issuePage(repo, 1, signal)).flatMap(roadmapIssue);
}
