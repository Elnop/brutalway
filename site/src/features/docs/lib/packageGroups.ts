import { DOC_SOURCES, PACKAGES_INDEX, README_FILE } from '@/features/docs/DocsConfig.ts';
import type { DocNavGroup, DocNavNode, NavContext, PackageCategory } from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';
import { sourceNodes } from '@/features/docs/lib/sourceNodes.ts';

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
  return `${docHref(PACKAGES_INDEX, README_FILE)}#${slug}`;
}

function categoryNode(category: PackageCategory, context: NavContext): DocNavNode {
  const isOpen = context.route.source.key === PACKAGES_INDEX.key && context.route.section === category.slug;
  return { kind: 'category', title: category.title, href: categoryHref(category.slug), current: isOpen ? 'location' : undefined, children: categoryContents(category, context) };
}

export function packageGroups(categories: PackageCategory[], context: NavContext): DocNavGroup[] {
  const isIndex = context.route.source.key === PACKAGES_INDEX.key;
  const index: DocNavGroup = {
    key: PACKAGES_INDEX.key,
    label: PACKAGES_INDEX.label,
    href: docHref(PACKAGES_INDEX, README_FILE),
    isTitle: true,
    current: isIndex && context.route.section === undefined ? 'page' : undefined,
    nodes: [],
  };
  return [
    index,
    ...categories.map((category) => ({ key: category.slug, label: category.title, href: categoryHref(category.slug), isTitle: false, current: undefined, nodes: categoryContents(category, context) })),
  ];
}
