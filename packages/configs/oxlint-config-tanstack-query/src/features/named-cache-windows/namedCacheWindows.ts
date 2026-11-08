import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

const CACHE_WINDOWS = new Set(['staleTime', 'gcTime']);

function isNumber(node: ESTree.Node): boolean {
  if (node.type === 'Literal') return typeof node.value === 'number';
  if (node.type === 'Identifier') return node.name === 'Infinity';
  if (node.type === 'UnaryExpression') return isNumber(node.argument);
  if (node.type === 'BinaryExpression') return isNumber(node.left) && isNumber(node.right);
  return false;
}

export const namedCacheWindows = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'staleTime and gcTime come from the named profiles of QueryConfig.ts.' },
    messages: { magicWindow: '{{name}} takes a named profile from QueryConfig.ts, not a number, so the cache is tuned from one file.' },
    schema: [],
  },
  create(context) {
    return {
      Property(property) {
        if (property.key.type !== 'Identifier' || !CACHE_WINDOWS.has(property.key.name) || !isNumber(property.value)) return;
        context.report({ node: property.value, messageId: 'magicWindow', data: { name: property.key.name } });
      },
    };
  },
});
