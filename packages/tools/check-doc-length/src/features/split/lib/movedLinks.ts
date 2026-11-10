import { posix } from 'node:path';
import { applyEdits } from '#src/features/split/lib/applyEdits.ts';
import { linkEdits } from '#src/features/split/lib/linkEdits.ts';
import { markdownTree } from '#src/features/split/lib/markdownTree.ts';
import type { MovedDoc, Target } from '#src/features/split/SplitTypes.ts';
import type { WrittenFile } from '#src/shared-features/docs/DocLengthTypes.ts';

function linkTo(from: string, target: Target): string {
  const anchor = target.slug === undefined ? '' : `#${target.slug}`;
  if (target.path === from) return anchor === '' ? `./${posix.basename(from)}` : anchor;
  return `${posix.relative(posix.dirname(from), target.path)}${anchor}`;
}

function isExternal(url: string): boolean {
  return /^[a-z][\w+.-]*:/iu.test(url) || url.startsWith('/');
}

export function movedUrl(url: string, from: string, moved: MovedDoc): string | undefined {
  if (isExternal(url)) return undefined;
  const [pathPart = '', anchor] = url.split('#');
  const resolved = pathPart === '' ? moved.docPath : posix.normalize(posix.join(posix.dirname(moved.docPath), pathPart));
  if (resolved !== moved.docPath) return `${posix.relative(posix.dirname(from), resolved)}${anchor === undefined ? '' : `#${anchor}`}`;
  const target = anchor === undefined ? undefined : moved.targets.get(anchor);
  return linkTo(from, target ?? { path: moved.indexPath, slug: anchor });
}

export function rewrittenLinks(other: WrittenFile, moved: MovedDoc): WrittenFile[] {
  const otherEdits = linkEdits(other.content, markdownTree(other.content), (url) => {
    if (isExternal(url)) return undefined;
    const [pathPart = '', anchor] = url.split('#');
    if (pathPart === '' || posix.normalize(posix.join(posix.dirname(other.path), pathPart)) !== moved.docPath) return undefined;
    const target = anchor === undefined ? undefined : moved.targets.get(anchor);
    return linkTo(other.path, target ?? { path: moved.indexPath, slug: anchor });
  });
  return otherEdits.length === 0 ? [] : [{ path: other.path, content: applyEdits(other.content, otherEdits) }];
}
