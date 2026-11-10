import { statSync } from 'node:fs';
import { isAbsolute, join, normalize, posix } from 'node:path';
import type { Nodes } from 'mdast';
import { linkTarget } from '#src/features/citations/lib/linkTarget.ts';

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

export function citedFile(cwd: string, doc: string, node: Nodes): string | undefined {
  const path = citedPath(cwd, doc, node);
  return path === undefined || path.endsWith('.md') || !isFile(cwd, path) ? undefined : path;
}
