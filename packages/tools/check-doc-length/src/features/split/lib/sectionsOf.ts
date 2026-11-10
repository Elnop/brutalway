import type { Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import type { Section } from '#src/features/split/SplitTypes.ts';

export function sectionsOf(tree: Root): Section[] {
  return tree.children.flatMap((node) =>
    node.type === 'heading' && node.position?.start.offset !== undefined ? [{ node, start: node.position.start.offset, depth: node.depth, text: toString(node) }] : [],
  );
}
