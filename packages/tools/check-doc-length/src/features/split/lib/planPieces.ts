import { posix } from 'node:path';
import GithubSlugger from 'github-slugger';
import type { Piece, PlanRange, Section } from '#src/features/split/SplitTypes.ts';
import type { DocLengthSettings } from '#src/shared-features/docs/DocLengthTypes.ts';

function sectionEnd(sections: Section[], section: Section, limit: number): number {
  return sections.find((other) => other.start > section.start && other.depth <= section.depth && other.start < limit)?.start ?? limit;
}

function fileName(slugger: GithubSlugger, title: string, index: number, settings: DocLengthSettings): string {
  const slug = slugger.slug(title);
  return settings.orderPrefix ? `${String(index + 1).padStart(2, '0')}-${slug}` : slug;
}

export function planPieces(sections: Section[], range: PlanRange, settings: DocLengthSettings): Piece[] {
  const children = sections.filter((section) => section.depth === range.depth && section.start >= range.from && section.start < range.to);
  const index: Piece = { path: posix.join(range.dir, settings.indexName), start: range.from, end: children[0]?.start ?? range.to, shift: Math.max(range.depth - 2, 0), children: [] };
  const slugger = new GithubSlugger();
  const pieces = children.flatMap((child, position) => {
    const end = sectionEnd(sections, child, range.to);
    const name = fileName(slugger, child.text, position, settings);
    const nested = range.depth < settings.fileDepth && sections.some((section) => section.depth === range.depth + 1 && section.start > child.start && section.start < end);
    const childPieces = nested
      ? planPieces(sections, { from: child.start, to: end, depth: range.depth + 1, dir: posix.join(range.dir, name) }, settings)
      : [{ path: posix.join(range.dir, `${name}.md`), start: child.start, end, shift: range.depth - 1, children: [] }];
    index.children.push({ title: child.text, path: childPieces[0]?.path ?? '' });
    return childPieces;
  });
  return [index, ...pieces];
}
