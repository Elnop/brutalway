import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocHeading, DocNavGroup, DocNavNode, DocSource, DocsRoute } from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';

const README = 'README.md';

function folderOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

function parentPage(path: string, paths: Set<string>): string | undefined {
  const folder = folderOf(path);
  let current = path.endsWith(`/${README}`) ? folderOf(folder) : folder;
  while (current !== '') {
    const candidate = `${current}/${README}`;
    if (paths.has(candidate)) return candidate;
    current = folderOf(current);
  }
  return undefined;
}

function sectionNodes(pageHref: string, headings: DocHeading[], section: string | undefined): DocNavNode[] {
  const nodes: DocNavNode[] = [];
  const topDepth = Math.min(...headings.map((heading) => heading.depth));
  for (const heading of headings) {
    const node: DocNavNode = { kind: 'section', title: heading.text, href: `${pageHref}#${heading.slug}`, current: heading.slug === section ? 'location' : undefined, children: [] };
    const parent = nodes.at(-1);
    if (heading.depth > topDepth && parent !== undefined) parent.children.push(node);
    else nodes.push(node);
  }
  return nodes;
}

function sourceNodes(source: DocSource, entries: DocEntry[], route: DocsRoute, headings: DocHeading[]): DocNavNode[] {
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
    return { kind: 'page', title: entry.title, href, current: isOpen ? 'page' : undefined, children: [...sections, ...pages] };
  }
  return (childrenOf.get(undefined) ?? []).map(build);
}

export function docNavGroups(entries: DocEntry[], route: DocsRoute, headings: DocHeading[]): DocNavGroup[] {
  return DOC_SOURCES.filter((source) => source.route === route.source.route).map((source) => ({
    key: source.key,
    label: source.label,
    href: docHref(source, source.files[0] ?? ''),
    nodes: sourceNodes(
      source,
      entries.filter((entry) => entry.sourceKey === source.key),
      route,
      headings,
    ),
  }));
}
