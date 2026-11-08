import type { Nodes, Root } from 'mdast';
import type { TextEdit } from '#src/features/split/SplitTypes.ts';

function urlNodes(node: Nodes): Nodes[] {
  const own = node.type === 'link' || node.type === 'image' || node.type === 'definition' ? [node] : [];
  return 'children' in node ? [...own, ...node.children.flatMap((child) => urlNodes(child))] : own;
}

function urlStart(source: string, node: Nodes, url: string): number | undefined {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (start === undefined || end === undefined) return undefined;
  const slice = source.slice(start, end);
  const marker = node.type === 'definition' ? slice.indexOf(']:') : slice.lastIndexOf('](');
  if (marker === -1) return undefined;
  const index = slice.indexOf(url, marker + 2);
  return index === -1 ? undefined : start + index;
}

export function linkEdits(source: string, tree: Root, rewrite: (url: string, offset: number) => string | undefined): TextEdit[] {
  return urlNodes(tree).flatMap((node) => {
    if (!('url' in node) || node.url === '') return [];
    const start = urlStart(source, node, node.url);
    if (start === undefined) return [];
    const text = rewrite(node.url, start);
    return text === undefined || text === node.url ? [] : [{ start, end: start + node.url.length, text }];
  });
}
