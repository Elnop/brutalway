import type { Nodes } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import type { ExternalLink, MarkdownFile } from './DocLinksTypes.ts';

function urlNodes(node: Nodes): Nodes[] {
  const own = node.type === 'link' || node.type === 'image' || node.type === 'definition' ? [node] : [];
  return 'children' in node ? [...own, ...node.children.flatMap((child) => urlNodes(child))] : own;
}

export function externalLinks(doc: MarkdownFile): ExternalLink[] {
  const tree = fromMarkdown(doc.content, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  return urlNodes(tree).flatMap((node) => ('url' in node && /^https?:\/\//iu.test(node.url) ? [{ doc: doc.path, url: node.url, line: node.position?.start.line ?? 1 }] : []));
}
