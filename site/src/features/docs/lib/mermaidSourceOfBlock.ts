import type { ExtraProps } from 'react-markdown';

export function mermaidSourceOfBlock(block: ExtraProps['node']): string | undefined {
  const code = block?.children[0];
  if (code?.type !== 'element' || code.tagName !== 'code') return undefined;
  const classes = code.properties['className'];
  if (!Array.isArray(classes) || !classes.includes('language-mermaid')) return undefined;
  const text = code.children[0];
  return text?.type === 'text' ? text.value.replace(/\n$/u, '') : undefined;
}
