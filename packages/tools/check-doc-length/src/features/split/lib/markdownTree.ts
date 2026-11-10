import type { Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { frontmatter } from 'micromark-extension-frontmatter';
import { gfm } from 'micromark-extension-gfm';

export function markdownTree(source: string): Root {
  return fromMarkdown(source, {
    extensions: [frontmatter(['yaml']), gfm()],
    mdastExtensions: [frontmatterFromMarkdown(['yaml']), gfmFromMarkdown()],
  });
}
