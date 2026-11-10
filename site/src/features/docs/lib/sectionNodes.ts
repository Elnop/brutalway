import type { DocHeading, DocNavNode } from '@/features/docs/DocsTypes.ts';

export function holdsCurrent(node: DocNavNode): boolean {
  return node.current !== undefined || node.children.some(holdsCurrent);
}

function foldOutsideCurrent(node: DocNavNode): DocNavNode {
  return { ...node, children: holdsCurrent(node) ? node.children.map(foldOutsideCurrent) : [] };
}

export function sectionNodes(
  pageHref: string,
  headings: DocHeading[],
  section: string | undefined,
): DocNavNode[] {
  const roots: DocNavNode[] = [];
  const open: { depth: number; node: DocNavNode }[] = [];
  for (const heading of headings) {
    const node: DocNavNode = {
      kind: 'section',
      title: heading.text,
      href: `${pageHref}#${heading.slug}`,
      current: heading.slug === section ? 'location' : undefined,
      children: [],
    };
    while ((open.at(-1)?.depth ?? 0) >= heading.depth) open.pop();
    const parent = open.at(-1);
    if (parent === undefined) roots.push(node);
    else parent.node.children.push(node);
    open.push({ depth: heading.depth, node });
  }
  return roots.map(foldOutsideCurrent);
}
