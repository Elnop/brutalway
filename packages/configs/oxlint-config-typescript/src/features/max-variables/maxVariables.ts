import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

const DEFAULT_MAX = 5;

function boundNames(pattern: ESTree.Node | null): number {
  if (pattern === null) return 0;
  if (pattern.type === 'Identifier') return 1;
  if (pattern.type === 'AssignmentPattern') return boundNames(pattern.left);
  if (pattern.type === 'RestElement') return boundNames(pattern.argument);
  if (pattern.type === 'ArrayPattern') return pattern.elements.reduce((total, element) => total + boundNames(element), 0);
  if (pattern.type === 'ObjectPattern') return pattern.properties.reduce((total, property) => total + boundNames(property.type === 'Property' ? property.value : property), 0);
  return 0;
}

export const maxVariables = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'A function declares 5 local variables at most.' },
    messages: {
      tooMany: 'This function declares {{count}} variables, {{max}} at most: split it, or group the values that go together in a type.',
    },
    schema: [{ type: 'object', properties: { max: { type: 'integer', minimum: 0 } }, additionalProperties: false }],
  },
  create(context) {
    const option: unknown = context.options[0];
    const max = typeof option === 'object' && option !== null && typeof Reflect.get(option, 'max') === 'number' ? Number(Reflect.get(option, 'max')) : DEFAULT_MAX;
    const counts: number[] = [];

    function enter() {
      counts.push(0);
    }

    function exit(node: ESTree.Node) {
      const count = counts.pop() ?? 0;
      if (count > max) context.report({ node, messageId: 'tooMany', data: { count: String(count), max: String(max) } });
    }

    return {
      FunctionDeclaration: enter,
      FunctionExpression: enter,
      ArrowFunctionExpression: enter,
      'FunctionDeclaration:exit': exit,
      'FunctionExpression:exit': exit,
      'ArrowFunctionExpression:exit': exit,
      VariableDeclarator(declarator) {
        const last = counts.length - 1;
        if (last >= 0) counts[last] = (counts[last] ?? 0) + boundNames(declarator.id);
      },
    };
  },
});
