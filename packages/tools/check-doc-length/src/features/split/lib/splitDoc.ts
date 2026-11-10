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

function plan(sections: Section[], from: number, to: number, depth: number, dir: string, settings: DocLengthSettings): Piece[] {
  const children = sections.filter((section) => section.depth === depth && section.start >= from && section.start < to);
  const index: Piece = { path: posix.join(dir, settings.indexName), start: from, end: children[0]?.start ?? to, shift: Math.max(depth - 2, 0), children: [] };
  const slugger = new GithubSlugger();
  const pieces = children.flatMap((child, position) => {
    const end = sectionEnd(sections, child, to);
    const name = fileName(slugger, child.text, position, settings);
    const nested = depth < settings.fileDepth && sections.some((section) => section.depth === depth + 1 && section.start > child.start && section.start < end);
    const childPieces = nested
      ? plan(sections, child.start, end, depth + 1, posix.join(dir, name), settings)
      : [{ path: posix.join(dir, `${name}.md`), start: child.start, end, shift: depth - 1, children: [] }];
    index.children.push({ title: child.text, path: childPieces[0]?.path ?? '' });
    return childPieces;
  });
  return [index, ...pieces];
}

function pieceAt(pieces: Piece[], offset: number): Piece | undefined {
  return pieces.find((piece) => offset >= piece.start && offset < piece.end);
}

function targetsOf(sections: Section[], pieces: Piece[]): Map<string, Target> {
  const docSlugger = new GithubSlugger();
  const pieceSluggers = new Map<string, GithubSlugger>();
  const targets = new Map<string, Target>();
  for (const section of sections) {
    const oldSlug = docSlugger.slug(section.text);
    const piece = pieceAt(pieces, section.start);
    if (piece === undefined) continue;
    const slugger = pieceSluggers.get(piece.path) ?? new GithubSlugger();
    pieceSluggers.set(piece.path, slugger);
    const slug = slugger.slug(section.text);
    targets.set(oldSlug, { path: piece.path, slug: section.start === piece.start && piece.shift > 0 ? undefined : slug });
  }
  return targets;
}

function linkTo(from: string, target: Target): string {
  const anchor = target.slug === undefined ? '' : `#${target.slug}`;
  if (target.path === from) return anchor === '' ? `./${posix.basename(from)}` : anchor;
  return `${posix.relative(posix.dirname(from), target.path)}${anchor}`;
}

function isExternal(url: string): boolean {
  return /^[a-z][\w+.-]*:/iu.test(url) || url.startsWith('/');
}

function movedUrl(url: string, from: string, docPath: string, targets: Map<string, Target>, indexPath: string): string | undefined {
  if (isExternal(url)) return undefined;
  const [pathPart = '', anchor] = url.split('#');
  const resolved = pathPart === '' ? docPath : posix.normalize(posix.join(posix.dirname(docPath), pathPart));
  if (resolved !== docPath) return `${posix.relative(posix.dirname(from), resolved)}${anchor === undefined ? '' : `#${anchor}`}`;
  const target = anchor === undefined ? undefined : targets.get(anchor);
  return linkTo(from, target ?? { path: indexPath, slug: anchor });
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

type MovedDoc = { docPath: string; targets: Map<string, Target>; indexPath: string };

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

export function splitDoc(docPath: string, source: string, others: WrittenFile[], settings: DocLengthSettings): SplitPlan {
  const tree = markdownTree(source);
  const sections = sectionsOf(tree);
  if (!sections.some((section) => section.depth === 2)) throw new Error(`${docPath} has no heading of depth 2 to split along`);
  const dir = posix.join(posix.dirname(docPath), posix.basename(docPath, '.md'));
  const pieces = plan(sections, 0, source.length, 2, dir, settings);
  const indexPath = pieces[0]?.path ?? dir;
  const targets = targetsOf(sections, pieces);
  const edits = [...headingEdits(source, sections, pieces), ...linkEdits(source, tree, (url, offset) => movedUrl(url, pieceAt(pieces, offset)?.path ?? indexPath, docPath, targets, indexPath))];
  const written = pieces.map((piece) => ({ path: piece.path, content: pieceContent(source, piece, edits) }));
  const rewritten = others.flatMap((other) => rewrittenLinks(other, { docPath, targets, indexPath }));
  return { removed: docPath, written: [...written, ...rewritten] };
}
