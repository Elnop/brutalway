import { DOC_SOURCES, PACKAGES_INDEX } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocHeading, DocNavGroup, DocNavNode, DocSource, DocsRoute, PackageCategory } from '@/features/docs/DocsTypes.ts';
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

type NavContext = {
  entries: DocEntry[];
  route: DocsRoute;
  headings: DocHeading[];
};

function packageNode(url: string, context: NavContext): DocNavNode[] {
  const source = DOC_SOURCES.find((candidate) => candidate.directory === `packages/${url.replace(/\/+$/u, '')}`);
  if (source === undefined) return [];
  const [readme, ...others] = sourceNodes(
    source,
    context.entries.filter((entry) => entry.sourceKey === source.key),
    context.route,
    context.headings,
  );
  if (readme === undefined) return [];
  const children = source.key === context.route.source.key ? [...readme.children, ...others.map((node) => ({ ...node, kind: 'detail' as const }))] : [];
  return [{ kind: 'page', title: source.key.replace(/^(?:oxlint-config|eslint-plugin)-/u, ''), href: readme.href, current: readme.current, children }];
}

function categoryContents(category: PackageCategory, context: NavContext): DocNavNode[] {
  return [...category.packages.flatMap((url) => packageNode(url, context)), ...category.children.map((child) => categoryNode(child, context))];
}

function categoryHref(slug: string): string {
  return `${docHref(PACKAGES_INDEX, README)}#${slug}`;
}

function categoryNode(category: PackageCategory, context: NavContext): DocNavNode {
  const isOpen = context.route.source.key === PACKAGES_INDEX.key && context.route.section === category.slug;
  return { kind: 'category', title: category.title, href: categoryHref(category.slug), current: isOpen ? 'location' : undefined, children: categoryContents(category, context) };
}

function packageGroups(categories: PackageCategory[], context: NavContext): DocNavGroup[] {
  const index = { key: PACKAGES_INDEX.key, label: PACKAGES_INDEX.label, href: docHref(PACKAGES_INDEX, README), isTitle: true, nodes: [] };
  return [index, ...categories.map((category) => ({ key: category.slug, label: category.title, href: categoryHref(category.slug), isTitle: false, nodes: categoryContents(category, context) }))];
}

export function docNavGroups(entries: DocEntry[], route: DocsRoute, headings: DocHeading[], categories: PackageCategory[] = []): DocNavGroup[] {
  if (route.source.route === PACKAGES_INDEX.route && categories.length > 0) return packageGroups(categories, { entries, route, headings });
  return DOC_SOURCES.filter((source) => source.route === route.source.route).map((source) => ({
    key: source.key,
    label: source.label,
    href: docHref(source, source.files[0] ?? ''),
    isTitle: false,
    nodes: sourceNodes(
      source,
      entries.filter((entry) => entry.sourceKey === source.key),
      route,
      headings,
    ),
  }));
}
