import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export function mermaidSources(markdown: string): string[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  return tree.children.flatMap((node) =>
    node.type === 'code' && node.lang === 'mermaid' ? [node.value] : [],
  );
}
