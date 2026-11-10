import { README_FILE } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocHeading, DocNavNode, DocSource, DocsRoute } from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';
import { holdsCurrent, sectionNodes } from '@/features/docs/lib/sectionNodes.ts';

function folderOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

function parentPage(path: string, paths: Set<string>): string | undefined {
  const folder = folderOf(path);
  let current = path.endsWith(`/${README_FILE}`) ? folderOf(folder) : folder;
  while (current !== '') {
    const candidate = `${current}/${README_FILE}`;
    if (paths.has(candidate)) return candidate;
    current = folderOf(current);
  }
  return undefined;
}

export function sourceNodes(source: DocSource, entries: DocEntry[], route: DocsRoute, headings: DocHeading[]): DocNavNode[] {
  const paths = new Set(entries.map((entry) => entry.path));
  const childrenOf = new Map<string | undefined, DocEntry[]>();
  for (const entry of entries) {
    const parent = parentPage(entry.path, paths);
    childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), entry]);
  }
  function build(entry: DocEntry): DocNavNode {
    const href = docHref(source, entry.path);
    const isOpen = source.key === route.source.key && entry.path === route.path;
    const sections = isOpen ? sectionNodes(href, headings, route.section) : [];
    const pages = (childrenOf.get(entry.path) ?? []).map(build);
    const unfolded = isOpen || pages.some(holdsCurrent);
    return { kind: 'page', title: entry.title, href, current: isOpen ? 'page' : undefined, children: unfolded ? [...sections, ...pages] : [] };
  }
  return (childrenOf.get(undefined) ?? []).map(build);
}
