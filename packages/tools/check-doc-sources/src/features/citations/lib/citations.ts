import { statSync } from 'node:fs';
import { isAbsolute, join, normalize, posix } from 'node:path';
import type { Nodes } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import type { Citation, MarkdownFile } from '#src/features/citations/DocSourcesTypes.ts';

const URL_SCHEME = /^[a-z][\d+.a-z-]*:/iu;

function citedNodes(node: Nodes): Nodes[] {
  const own = node.type === 'inlineCode' || node.type === 'link' || node.type === 'definition' ? [node] : [];
  return 'children' in node ? [...own, ...node.children.flatMap((child) => citedNodes(child))] : own;
}

function linkTarget(doc: string, url: string): string | undefined {
  if (url === '' || url.startsWith('#') || url.startsWith('/') || URL_SCHEME.test(url)) return undefined;
  const [path = ''] = url.split(/[#?]/u);
  return posix.join(posix.dirname(doc), decodeURI(path));
}

function isFile(cwd: string, path: string): boolean {
  if (path.startsWith('..') || isAbsolute(path)) return false;
  return statSync(join(cwd, normalize(path)), { throwIfNoEntry: false })?.isFile() === true;
}

function folders(doc: string): string[] {
  const parent = posix.dirname(doc);
  return parent === '.' ? ['.'] : [parent, ...folders(parent)];
}

function nearestFile(cwd: string, doc: string, code: string): string | undefined {
  if (!/^[^\s<>*]+$/u.test(code)) return undefined;
  return folders(doc)
    .map((folder) => posix.join(folder, code))
    .find((path) => isFile(cwd, path));
}

function citedPath(cwd: string, doc: string, node: Nodes): string | undefined {
  if (node.type === 'inlineCode') return nearestFile(cwd, doc, node.value);
  return 'url' in node ? linkTarget(doc, node.url) : undefined;
}

function citedFile(cwd: string, doc: string, node: Nodes): string | undefined {
  const path = citedPath(cwd, doc, node);
  return path === undefined || path.endsWith('.md') || !isFile(cwd, path) ? undefined : path;
}

export function citations(cwd: string, doc: MarkdownFile): Citation[] {
  const tree = fromMarkdown(doc.content, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  const byFile = new Map<string, Citation>();
  for (const node of citedNodes(tree)) {
    const file = citedFile(cwd, doc.path, node);
    if (file === undefined || byFile.has(file)) continue;
    byFile.set(file, { doc: doc.path, file, line: node.position?.start.line ?? 1 });
  }
  return [...byFile.values()];
}
