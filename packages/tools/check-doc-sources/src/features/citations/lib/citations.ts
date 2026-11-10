import type { Nodes } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import { citedFile } from '#src/features/citations/lib/citedFile.ts';
import type { Citation, MarkdownFile } from '#src/features/citations/DocSourcesTypes.ts';

function citedNodes(node: Nodes): Nodes[] {
  const own =
    node.type === 'inlineCode' || node.type === 'link' || node.type === 'definition' ? [node] : [];
  return 'children' in node
    ? [...own, ...node.children.flatMap((child) => citedNodes(child))]
    : own;
}

export function citations(cwd: string, doc: MarkdownFile): Citation[] {
  const tree = fromMarkdown(doc.content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });
  const byFile = new Map<string, Citation>();
  for (const node of citedNodes(tree)) {
    const file = citedFile(cwd, doc.path, node);
    if (file === undefined || byFile.has(file)) continue;
    byFile.set(file, { doc: doc.path, file, line: node.position?.start.line ?? 1 });
  }
  return [...byFile.values()];
}
