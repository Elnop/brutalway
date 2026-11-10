import type { RoadmapIssue } from '@/features/docs/DocsTypes.ts';
import { isRecord } from '@/features/docs/lib/isRecord.ts';

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

export function roadmapIssue(value: unknown): RoadmapIssue[] {
  if (!isRecord(value) || value['pull_request'] !== undefined) return [];
  const { number, title, html_url: url } = value;
  if (typeof number !== 'number' || typeof title !== 'string' || typeof url !== 'string') return [];
  return [{ number, title, url, ...issueStatus(value) }];
}
