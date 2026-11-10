import { posix } from 'node:path';
import { markdownTree } from '#src/features/split/lib/markdownTree.ts';
import { rewrittenLinks } from '#src/features/split/lib/movedLinks.ts';
import { planPieces } from '#src/features/split/lib/planPieces.ts';
import { sectionsOf } from '#src/features/split/lib/sectionsOf.ts';
import { targetsOf } from '#src/features/split/lib/targetsOf.ts';
import { writtenPieces } from '#src/features/split/lib/writtenPieces.ts';
import type { MovedDoc, SplitPlan } from '#src/features/split/SplitTypes.ts';
import type { DocLengthSettings, WrittenFile } from '#src/shared-features/docs/DocLengthTypes.ts';

function splitDir(docPath: string): string {
  return posix.join(posix.dirname(docPath), posix.basename(docPath, '.md'));
}

export function splitDoc(docPath: string, source: string, others: WrittenFile[], settings: DocLengthSettings): SplitPlan {
  const tree = markdownTree(source);
  const sections = sectionsOf(tree);
  if (!sections.some((section) => section.depth === 2)) throw new Error(`${docPath} has no heading of depth 2 to split along`);
  const pieces = planPieces(sections, { from: 0, to: source.length, depth: 2, dir: splitDir(docPath) }, settings);
  const moved: MovedDoc = { docPath, targets: targetsOf(sections, pieces), indexPath: pieces[0]?.path ?? splitDir(docPath) };
  const written = writtenPieces({ source, tree, sections, pieces }, moved);
  return { removed: docPath, written: [...written, ...others.flatMap((other) => rewrittenLinks(other, moved))] };
}
