import type { RoadmapIssue } from '@/features/docs/DocsTypes.ts';

type Status = 'in progress' | 'todo' | 'triage' | 'done';

const OPEN_STATUSES: Status[] = ['triage', 'in progress', 'todo'];

const STATUS_LABELS = new Set<string>(OPEN_STATUSES);

const REJECTED_LABELS = new Set(['duplicate', 'invalid', 'wontfix']);

const SECTIONS: { status: Status; heading: string; intro: string; newestFirst: boolean }[] = [
  { status: 'in progress', heading: 'In progress', intro: '', newestFirst: false },
  { status: 'todo', heading: 'To do', intro: '', newestFirst: false },
  { status: 'triage', heading: 'Waiting for triage', intro: 'Opened by someone outside the project. They join the roadmap once moved to `todo`.', newestFirst: false },
  { status: 'done', heading: 'Done', intro: '', newestFirst: true },
];

function issueStatus(issue: RoadmapIssue): Status | undefined {
  if (issue.labels.some((label) => REJECTED_LABELS.has(label))) return undefined;
  if (issue.closed) return issue.completed ? 'done' : undefined;
  return OPEN_STATUSES.find((status) => issue.labels.includes(status));
}

function escapeTitle(title: string): string {
  return title.replaceAll(/[\\[\]*_<>]/gu, (character) => `\\${character}`);
}

type Placed = { issue: RoadmapIssue; status: Status };

function issueLine(placed: Placed, parentStatus: Status | undefined): string {
  const tags = placed.issue.labels.filter((label) => !STATUS_LABELS.has(label) && !REJECTED_LABELS.has(label)).map((label) => `\`${label}\``);
  const status = parentStatus === undefined || parentStatus === placed.status ? [] : [placed.status];
  return [`[#${String(placed.issue.number)}](${placed.issue.url}) ${escapeTitle(placed.issue.title)}`, ...status, ...tags].join(' · ');
}

type IssueTree = { roots: Placed[]; childrenOf: Map<number, Placed[]> };

function issueTree(placed: Placed[]): IssueTree {
  const byNumber = new Map(placed.map((item) => [item.issue.number, item]));
  const childrenOf = new Map<number, Placed[]>();
  const roots: Placed[] = [];
  for (const item of placed.toSorted((first, second) => first.issue.number - second.issue.number)) {
    const parent = item.issue.parent === undefined ? undefined : byNumber.get(item.issue.parent);
    if (parent === undefined) roots.push(item);
    else childrenOf.set(parent.issue.number, [...(childrenOf.get(parent.issue.number) ?? []), item]);
  }
  return { roots, childrenOf };
}

function treeLines(tree: IssueTree, item: Placed, depth: number, parentStatus: Status | undefined): string[] {
  const children = tree.childrenOf.get(item.issue.number) ?? [];
  return [`${'  '.repeat(depth)}- ${issueLine(item, parentStatus)}`, ...children.flatMap((child) => treeLines(tree, child, depth + 1, item.status))];
}

function sectionBlocks(tree: IssueTree): string[] {
  return SECTIONS.flatMap(({ status, heading, intro, newestFirst }) => {
    const items = tree.roots.filter((item) => item.status === status);
    if (items.length === 0) return [];
    const ordered = newestFirst ? items.toReversed() : items;
    return [[`## ${heading}`, ...(intro === '' ? [] : [intro]), ordered.flatMap((item) => treeLines(tree, item, 0, undefined)).join('\n')].join('\n\n')];
  });
}

export function roadmapMarkdown(repo: string, issues: RoadmapIssue[]): string {
  const placed = issues.flatMap((issue) => {
    const status = issueStatus(issue);
    return status === undefined ? [] : [{ issue, status }];
  });
  const header = [
    '# Roadmap',
    `This page is read from the [issues of ${repo}](https://github.com/${repo}/issues) each time it opens. An open issue shows up once it carries a status label: \`todo\`, \`in progress\`, or \`triage\`, which an issue opened by someone outside the project gets until it is read. A closed issue shows up under Done, unless it was closed as not planned.`,
  ];
  return [...header, ...sectionBlocks(issueTree(placed))].join('\n\n');
}
