import { OPEN_STATUSES, REJECTED_LABELS } from '@/features/docs/DocsConfig.ts';
import type { IssueTree, PlacedIssue, RoadmapIssue, RoadmapStatus } from '@/features/docs/DocsTypes.ts';

function issueStatus(issue: RoadmapIssue): RoadmapStatus | undefined {
  if (issue.labels.some((label) => REJECTED_LABELS.has(label))) return undefined;
  if (issue.closed) return issue.completed ? 'done' : undefined;
  return OPEN_STATUSES.find((status) => issue.labels.includes(status));
}

function placedIssues(issues: RoadmapIssue[]): PlacedIssue[] {
  return issues.flatMap((issue) => {
    const status = issueStatus(issue);
    return status === undefined ? [] : [{ issue, status }];
  });
}

function issueTree(placed: PlacedIssue[]): IssueTree {
  const byNumber = new Map(placed.map((item) => [item.issue.number, item]));
  const childrenOf = new Map<number, PlacedIssue[]>();
  const roots: PlacedIssue[] = [];
  for (const item of placed.toSorted((first, second) => first.issue.number - second.issue.number)) {
    const parent = item.issue.parent === undefined ? undefined : byNumber.get(item.issue.parent);
    if (parent === undefined) roots.push(item);
    else childrenOf.set(parent.issue.number, [...(childrenOf.get(parent.issue.number) ?? []), item]);
  }
  return { roots, childrenOf };
}

export function roadmapIssueTree(issues: RoadmapIssue[]): IssueTree {
  return issueTree(placedIssues(issues));
}
