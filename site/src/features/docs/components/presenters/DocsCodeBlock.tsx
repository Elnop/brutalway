import type { ComponentProps } from 'react';
import type { ExtraProps } from 'react-markdown';
import { mermaidSourceOfBlock } from '@/features/docs/lib/mermaidSourceOfBlock.ts';

type DocsCodeBlockProps = ComponentProps<'pre'> &
  ExtraProps & {
    diagrams: Map<string, string>;
  };

export function DocsCodeBlock({ node, diagrams, ...props }: DocsCodeBlockProps) {
  const source = mermaidSourceOfBlock(node);
  const svg = source === undefined ? undefined : diagrams.get(source);
  if (svg === undefined) return <pre {...props} />;
  return <figure className="docs-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
}
