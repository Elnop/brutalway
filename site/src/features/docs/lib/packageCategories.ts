import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { PackageCategory } from '@/features/docs/DocsTypes.ts';

const CATEGORY_DEPTH = 2;

type MarkdownNode = ReturnType<typeof parseMarkdown>['children'][number];
type Heading = Extract<MarkdownNode, { type: 'heading' }>;
type Table = Extract<MarkdownNode, { type: 'table' }>;

function parseMarkdown(markdown: string) {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown);
}

function headingCategory(node: Heading, slugger: GithubSlugger): PackageCategory | undefined {
  const title = toString(node, { includeImageAlt: false });
  const slug = slugger.slug(title);
  return node.depth < CATEGORY_DEPTH ? undefined : { title, slug, depth: node.depth, packages: [], children: [] };
}

function addCategory(roots: PackageCategory[], open: PackageCategory[], category: PackageCategory) {
  while ((open.at(-1)?.depth ?? 0) >= category.depth) open.pop();
  const parent = open.at(-1);
  if (parent === undefined) roots.push(category);
  else parent.children.push(category);
  open.push(category);
}

function tableLinks(node: Table): string[] {
  return node.children.slice(1).flatMap((row) => (row.children[0]?.children ?? []).flatMap((child) => (child.type === 'link' ? [child.url] : [])).slice(0, 1));
}

export function packageCategories(markdown: string): PackageCategory[] {
  const slugger = new GithubSlugger();
  const roots: PackageCategory[] = [];
  const open: PackageCategory[] = [];
  for (const node of parseMarkdown(markdown).children) {
    const category = node.type === 'heading' ? headingCategory(node, slugger) : undefined;
    if (category !== undefined) addCategory(roots, open, category);
    if (node.type === 'table') open.at(-1)?.packages.push(...tableLinks(node));
  }
  return roots;
}
