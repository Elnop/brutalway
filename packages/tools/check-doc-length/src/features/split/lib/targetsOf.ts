import GithubSlugger from 'github-slugger';
import { pieceAt } from '#src/features/split/lib/pieceAt.ts';
import type { Piece, Section, Target } from '#src/features/split/SplitTypes.ts';

function targetOf(section: Section, piece: Piece, pieceSluggers: Map<string, GithubSlugger>): Target {
  const slugger = pieceSluggers.get(piece.path) ?? new GithubSlugger();
  pieceSluggers.set(piece.path, slugger);
  const slug = slugger.slug(section.text);
  return { path: piece.path, slug: section.start === piece.start && piece.shift > 0 ? undefined : slug };
}

export function targetsOf(sections: Section[], pieces: Piece[]): Map<string, Target> {
  const docSlugger = new GithubSlugger();
  const pieceSluggers = new Map<string, GithubSlugger>();
  return new Map(
    sections.flatMap((section): [string, Target][] => {
      const oldSlug = docSlugger.slug(section.text);
      const piece = pieceAt(pieces, section.start);
      return piece === undefined ? [] : [[oldSlug, targetOf(section, piece, pieceSluggers)]];
    }),
  );
}
