import { OPEN_STATUSES, REJECTED_LABELS } from '@/features/docs/DocsConfig.ts';
import type { IssueTree, PlacedIssue, RoadmapIssue, RoadmapStatus } from '@/features/docs/DocsTypes.ts';
import { roadmapIssueTree } from '@/features/docs/lib/roadmapIssueTree.ts';

const STATUS_LABELS = new Set<string>(OPEN_STATUSES);

const SECTIONS: { status: RoadmapStatus; heading: string; intro: string; newestFirst: boolean }[] = [
  { status: 'in progress', heading: 'In progress', intro: '', newestFirst: false },
  { status: 'todo', heading: 'To do', intro: '', newestFirst: false },
  { status: 'triage', heading: 'Waiting for triage', intro: 'Opened by someone outside the project. They join the roadmap once moved to `todo`.', newestFirst: false },
  { status: 'done', heading: 'Done', intro: '', newestFirst: true },
];

function escapeTitle(title: string): string {
  return title.replaceAll(/[\\[\]*_<>]/gu, (character) => `\\${character}`);
}

function issueLine(placed: PlacedIssue, parentStatus: RoadmapStatus | undefined): string {
  const tags = placed.issue.labels.filter((label) => !STATUS_LABELS.has(label) && !REJECTED_LABELS.has(label)).map((label) => `\`${label}\``);
  const status = parentStatus === undefined || parentStatus === placed.status ? [] : [placed.status];
  return [`[#${String(placed.issue.number)}](${placed.issue.url}) ${escapeTitle(placed.issue.title)}`, ...status, ...tags].join(' · ');
}

function treeLines(tree: IssueTree, item: PlacedIssue, depth: number, parentStatus: RoadmapStatus | undefined): string[] {
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
  const header = [
    '# Roadmap',
    `This page is read from the [issues of ${repo}](https://github.com/${repo}/issues) each time it opens. An open issue shows up once it carries a status label: \`todo\`, \`in progress\`, or \`triage\`, which an issue opened by someone outside the project gets until it is read. A closed issue shows up under Done, unless it was closed as not planned.`,
  ];
  return [...header, ...sectionBlocks(roadmapIssueTree(issues))].join('\n\n');
}
