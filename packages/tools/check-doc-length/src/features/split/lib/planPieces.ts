import { posix } from 'node:path';
import GithubSlugger from 'github-slugger';
import { sectionEnd } from '#src/features/split/lib/sectionEnd.ts';
import type { Piece, PlanRange, Section } from '#src/features/split/SplitTypes.ts';
import type { DocLengthSettings } from '#src/shared-features/docs/DocLengthTypes.ts';

type PlanStep = { sections: Section[]; range: PlanRange; settings: DocLengthSettings };

function fileName(
  slugger: GithubSlugger,
  title: string,
  index: number,
  settings: DocLengthSettings,
): string {
  const slug = slugger.slug(title);
  return settings.orderPrefix ? `${String(index + 1).padStart(2, '0')}-${slug}` : slug;
}

function childSections(sections: Section[], range: PlanRange): Section[] {
  return sections.filter(
    (section) =>
      section.depth === range.depth && section.start >= range.from && section.start < range.to,
  );
}

function hasNestedSections({ sections, range, settings }: PlanStep, child: Section, end: number) {
  return (
    range.depth < settings.fileDepth &&
    sections.some(
      (section) =>
        section.depth === range.depth + 1 && section.start > child.start && section.start < end,
    )
  );
}

function piecesOf(step: PlanStep, child: Section, name: string, end: number): Piece[] {
  const { sections, range, settings } = step;
  if (hasNestedSections(step, child, end)) {
    const nested = {
      from: child.start,
      to: end,
      depth: range.depth + 1,
      dir: posix.join(range.dir, name),
    };
    return planPieces(sections, nested, settings);
  }
  const path = posix.join(range.dir, `${name}.md`);
  return [{ path, start: child.start, end, shift: range.depth - 1, children: [] }];
}

export function planPieces(
  sections: Section[],
  range: PlanRange,
  settings: DocLengthSettings,
): Piece[] {
  const step = { sections, range, settings };
  const children = childSections(sections, range);
  const index: Piece = {
    path: posix.join(range.dir, settings.indexName),
    start: range.from,
    end: children[0]?.start ?? range.to,
    shift: Math.max(range.depth - 2, 0),
    children: [],
  };
  const slugger = new GithubSlugger();
  const pieces = children.flatMap((child, position) => {
    const name = fileName(slugger, child.text, position, settings);
    const childPieces = piecesOf(step, child, name, sectionEnd(sections, child, range.to));
    index.children.push({ title: child.text, path: childPieces[0]?.path ?? '' });
    return childPieces;
  });
  return [index, ...pieces];
}
