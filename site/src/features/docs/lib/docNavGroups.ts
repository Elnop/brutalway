import { DOC_SOURCES, PACKAGES_INDEX } from '@/features/docs/DocsConfig.ts';
import type {
  DocEntry,
  DocHeading,
  DocNavGroup,
  DocsRoute,
  PackageCategory,
} from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';
import { packageGroups } from '@/features/docs/lib/packageGroups.ts';
import { sourceNodes } from '@/features/docs/lib/sourceNodes.ts';

export function docNavGroups(
  entries: DocEntry[],
  route: DocsRoute,
  headings: DocHeading[],
  categories: PackageCategory[] = [],
): DocNavGroup[] {
  if (route.source.route === PACKAGES_INDEX.route && categories.length > 0) {
    return packageGroups(categories, { entries, route, headings });
  }
  return DOC_SOURCES.filter((source) => source.route === route.source.route).map((source) => {
    const href = docHref(source, source.files[0] ?? '');
    const nodes = sourceNodes(source, { entries, route, headings });
    const landing = nodes.find((node) => node.href === href);
    return {
      key: source.key,
      label: source.label,
      href,
      isTitle: false,
      current: landing?.current,
      nodes: nodes.flatMap((node) => (node === landing ? node.children : [node])),
    };
  });
}
