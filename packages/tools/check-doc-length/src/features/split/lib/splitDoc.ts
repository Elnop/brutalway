import { posix } from 'node:path';
import GithubSlugger from 'github-slugger';
import type { Heading, Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { applyEdits } from '#src/features/split/lib/applyEdits.ts';
import { linkEdits } from '#src/features/split/lib/linkEdits.ts';
import { markdownTree } from '#src/features/split/lib/markdownTree.ts';
import type { SplitPlan, TextEdit } from '#src/features/split/SplitTypes.ts';
import type { DocLengthSettings, WrittenFile } from '#src/shared-features/docs/DocLengthTypes.ts';

type Section = { node: Heading; start: number; depth: number; text: string };
type Piece = { path: string; start: number; end: number; shift: number; children: { title: string; path: string }[] };
type Target = { path: string; slug: string | undefined };
type PlanRange = { from: number; to: number; depth: number; dir: string };
type MovedDoc = { docPath: string; targets: Map<string, Target>; indexPath: string };
type SplitSource = { source: string; tree: Root; sections: Section[]; pieces: Piece[] };

function sectionsOf(tree: Root): Section[] {
  return tree.children.flatMap((node) =>
    node.type === 'heading' && node.position?.start.offset !== undefined ? [{ node, start: node.position.start.offset, depth: node.depth, text: toString(node) }] : [],
  );
}

function sectionEnd(sections: Section[], section: Section, limit: number): number {
  return sections.find((other) => other.start > section.start && other.depth <= section.depth && other.start < limit)?.start ?? limit;
}

function fileName(slugger: GithubSlugger, title: string, index: number, settings: DocLengthSettings): string {
  const slug = slugger.slug(title);
  return settings.orderPrefix ? `${String(index + 1).padStart(2, '0')}-${slug}` : slug;
}

function plan(sections: Section[], range: PlanRange, settings: DocLengthSettings): Piece[] {
  const children = sections.filter((section) => section.depth === range.depth && section.start >= range.from && section.start < range.to);
  const index: Piece = { path: posix.join(range.dir, settings.indexName), start: range.from, end: children[0]?.start ?? range.to, shift: Math.max(range.depth - 2, 0), children: [] };
  const slugger = new GithubSlugger();
  const pieces = children.flatMap((child, position) => {
    const end = sectionEnd(sections, child, range.to);
    const name = fileName(slugger, child.text, position, settings);
    const nested = range.depth < settings.fileDepth && sections.some((section) => section.depth === range.depth + 1 && section.start > child.start && section.start < end);
    const childPieces = nested
      ? plan(sections, { from: child.start, to: end, depth: range.depth + 1, dir: posix.join(range.dir, name) }, settings)
      : [{ path: posix.join(range.dir, `${name}.md`), start: child.start, end, shift: range.depth - 1, children: [] }];
    index.children.push({ title: child.text, path: childPieces[0]?.path ?? '' });
    return childPieces;
  });
  return [index, ...pieces];
}

function pieceAt(pieces: Piece[], offset: number): Piece | undefined {
  return pieces.find((piece) => offset >= piece.start && offset < piece.end);
}

function targetOf(section: Section, piece: Piece, pieceSluggers: Map<string, GithubSlugger>): Target {
  const slugger = pieceSluggers.get(piece.path) ?? new GithubSlugger();
  pieceSluggers.set(piece.path, slugger);
  const slug = slugger.slug(section.text);
  return { path: piece.path, slug: section.start === piece.start && piece.shift > 0 ? undefined : slug };
}

function targetsOf(sections: Section[], pieces: Piece[]): Map<string, Target> {
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

function linkTo(from: string, target: Target): string {
  const anchor = target.slug === undefined ? '' : `#${target.slug}`;
  if (target.path === from) return anchor === '' ? `./${posix.basename(from)}` : anchor;
  return `${posix.relative(posix.dirname(from), target.path)}${anchor}`;
}

function isExternal(url: string): boolean {
  return /^[a-z][\w+.-]*:/iu.test(url) || url.startsWith('/');
}

function movedUrl(url: string, from: string, moved: MovedDoc): string | undefined {
  if (isExternal(url)) return undefined;
  const [pathPart = '', anchor] = url.split('#');
  const resolved = pathPart === '' ? moved.docPath : posix.normalize(posix.join(posix.dirname(moved.docPath), pathPart));
  if (resolved !== moved.docPath) return `${posix.relative(posix.dirname(from), resolved)}${anchor === undefined ? '' : `#${anchor}`}`;
  const target = anchor === undefined ? undefined : moved.targets.get(anchor);
  return linkTo(from, target ?? { path: moved.indexPath, slug: anchor });
}

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

function rewrittenLinks(other: WrittenFile, moved: MovedDoc): WrittenFile[] {
  const otherEdits = linkEdits(other.content, markdownTree(other.content), (url) => {
    if (isExternal(url)) return undefined;
    const [pathPart = '', anchor] = url.split('#');
    if (pathPart === '' || posix.normalize(posix.join(posix.dirname(other.path), pathPart)) !== moved.docPath) return undefined;
    const target = anchor === undefined ? undefined : moved.targets.get(anchor);
    return linkTo(other.path, target ?? { path: moved.indexPath, slug: anchor });
  });
  return otherEdits.length === 0 ? [] : [{ path: other.path, content: applyEdits(other.content, otherEdits) }];
}

function splitDir(docPath: string): string {
  return posix.join(posix.dirname(docPath), posix.basename(docPath, '.md'));
}

function writtenPieces(split: SplitSource, moved: MovedDoc): WrittenFile[] {
  const edits = [
    ...headingEdits(split.source, split.sections, split.pieces),
    ...linkEdits(split.source, split.tree, (url, offset) => movedUrl(url, pieceAt(split.pieces, offset)?.path ?? moved.indexPath, moved)),
  ];
  return split.pieces.map((piece) => ({ path: piece.path, content: pieceContent(split.source, piece, edits) }));
}

export function splitDoc(docPath: string, source: string, others: WrittenFile[], settings: DocLengthSettings): SplitPlan {
  const tree = markdownTree(source);
  const sections = sectionsOf(tree);
  if (!sections.some((section) => section.depth === 2)) throw new Error(`${docPath} has no heading of depth 2 to split along`);
  const pieces = plan(sections, { from: 0, to: source.length, depth: 2, dir: splitDir(docPath) }, settings);
  const moved: MovedDoc = { docPath, targets: targetsOf(sections, pieces), indexPath: pieces[0]?.path ?? splitDir(docPath) };
  const written = writtenPieces({ source, tree, sections, pieces }, moved);
  return { removed: docPath, written: [...written, ...others.flatMap((other) => rewrittenLinks(other, moved))] };
}
