import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

const KEY_ARGUMENT_METHODS = new Set([
  'getQueryData',
  'setQueryData',
  'getQueryState',
  'setQueriesData',
  'getQueriesData',
]);

function rootName(node: ESTree.Node): string | undefined {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression') return rootName(node.object);
  if (node.type === 'CallExpression') return rootName(node.callee);
  return undefined;
}

function fromFactory(node: ESTree.Node): boolean {
  return (
    (node.type === 'MemberExpression' || node.type === 'CallExpression') &&
    (rootName(node) ?? '').endsWith('Keys')
  );
}

function isInlineKeyProperty(property: { key: ESTree.Node; value: ESTree.Node }): boolean {
  return (
    property.key.type === 'Identifier' &&
    property.key.name === 'queryKey' &&
    !fromFactory(property.value)
  );
}

function inlineKeyArgument(call: ESTree.CallExpression): ESTree.Node | undefined {
  if (
    call.callee.type !== 'MemberExpression' ||
    call.callee.property.type !== 'Identifier' ||
    !KEY_ARGUMENT_METHODS.has(call.callee.property.name)
  ) {
    return undefined;
  }
  const [key] = call.arguments;
  if (key === undefined || key.type === 'ObjectExpression' || fromFactory(key)) return undefined;
  return key;
}

export const queryKeyFactory = defineRule({
  meta: {
    type: 'problem',
    docs: { description: 'A query key comes from an xKeys factory.' },
    messages: {
      inlineKey:
        'A query key comes from an xKeys factory (todosKeys.list(filter)), not written inline, so an invalidation reaches the same query.',
    },
    schema: [],
  },
  create(context) {
    return {
      Property(property) {
        if (isInlineKeyProperty(property)) {
          context.report({ node: property.value, messageId: 'inlineKey' });
        }
      },
      CallExpression(call) {
        const key = inlineKeyArgument(call);
        if (key !== undefined) context.report({ node: key, messageId: 'inlineKey' });
      },
    };
  },
});
