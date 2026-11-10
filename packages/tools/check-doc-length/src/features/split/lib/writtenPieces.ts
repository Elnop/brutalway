import { posix } from 'node:path';
import { applyEdits } from '#src/features/split/lib/applyEdits.ts';
import { linkEdits } from '#src/features/split/lib/linkEdits.ts';
import { movedUrl } from '#src/features/split/lib/movedLinks.ts';
import { pieceAt } from '#src/features/split/lib/pieceAt.ts';
import type { MovedDoc, Piece, Section, SplitSource, TextEdit } from '#src/features/split/SplitTypes.ts';
import type { WrittenFile } from '#src/shared-features/docs/DocLengthTypes.ts';

function headingEdit(source: string, section: Section, shift: number): TextEdit | undefined {
  const depth = Math.max(section.depth - shift, 1);
  if (shift === 0 || depth === section.depth) return undefined;
  const hashes = /^ {0,3}(#+)/u.exec(source.slice(section.start));
  if (hashes?.[1] !== undefined) {
    const start = section.start + hashes[0].length - hashes[1].length;
    return { start, end: start + hashes[1].length, text: '#'.repeat(depth) };
  }
  const end = section.node.position?.end.offset ?? section.start;
  const underline = source.slice(source.lastIndexOf('\n', end - 1) + 1, end);
  return { start: end - underline.length, end, text: underline.replaceAll('-', '=') };
}

function childList(piece: Piece): string {
  return piece.children.map((child) => `- [${child.title}](${posix.relative(posix.dirname(piece.path), child.path)})`).join('\n');
}

function pieceContent(source: string, piece: Piece, edits: TextEdit[]): string {
  const own = edits.filter((edit) => edit.start >= piece.start && edit.end <= piece.end);
  const text = applyEdits(source.slice(piece.start, piece.end), own, piece.start).trimEnd();
  return piece.children.length === 0 ? `${text}\n` : `${text}\n\n${childList(piece)}\n`;
}

function headingEdits(source: string, sections: Section[], pieces: Piece[]): TextEdit[] {
  return sections.flatMap((section) => {
    const edit = headingEdit(source, section, pieceAt(pieces, section.start)?.shift ?? 0);
    return edit === undefined ? [] : [edit];
  });
}

export function writtenPieces(split: SplitSource, moved: MovedDoc): WrittenFile[] {
  const edits = [
    ...headingEdits(split.source, split.sections, split.pieces),
    ...linkEdits(split.source, split.tree, (url, offset) => movedUrl(url, pieceAt(split.pieces, offset)?.path ?? moved.indexPath, moved)),
  ];
  return split.pieces.map((piece) => ({ path: piece.path, content: pieceContent(split.source, piece, edits) }));
}
