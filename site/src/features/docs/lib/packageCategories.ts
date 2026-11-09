import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { PackageCategory } from '@/features/docs/DocsTypes.ts';

const CATEGORY_DEPTH = 2;

export function packageCategories(markdown: string): PackageCategory[] {
  const slugger = new GithubSlugger();
  const roots: PackageCategory[] = [];
  const open: PackageCategory[] = [];
  for (const node of unified().use(remarkParse).use(remarkGfm).parse(markdown).children) {
    if (node.type === 'heading') {
      const title = toString(node, { includeImageAlt: false });
      const slug = slugger.slug(title);
      if (node.depth < CATEGORY_DEPTH) continue;
      while ((open.at(-1)?.depth ?? 0) >= node.depth) open.pop();
      const category: PackageCategory = { title, slug, depth: node.depth, packages: [], children: [] };
      const parent = open.at(-1);
      if (parent === undefined) roots.push(category);
      else parent.children.push(category);
      open.push(category);
    }
    if (node.type === 'table') {
      const links = node.children.slice(1).flatMap((row) => (row.children[0]?.children ?? []).flatMap((child) => (child.type === 'link' ? [child.url] : [])).slice(0, 1));
      open.at(-1)?.packages.push(...links);
    }
  }
  return roots;
}
