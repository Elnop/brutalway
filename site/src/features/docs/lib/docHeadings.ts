import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { DocHeading } from '@/features/docs/DocsTypes.ts';

const SECTION_DEPTHS = new Set([2, 3, 4]);

export function docHeadings(markdown: string): DocHeading[] {
  const slugger = new GithubSlugger();
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  return tree.children.flatMap((node) => {
    if (node.type !== 'heading') return [];
    const text = toString(node, { includeImageAlt: false });
    const slug = slugger.slug(text);
    return SECTION_DEPTHS.has(node.depth) ? [{ depth: node.depth, text, slug }] : [];
  });
}
