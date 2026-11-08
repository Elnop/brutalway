import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

function resolvesWithZod(options: ESTree.Node | undefined): boolean {
  if (options?.type !== 'ObjectExpression') return false;
  return options.properties.some(
    (property) =>
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === 'resolver' &&
      property.value.type === 'CallExpression' &&
      property.value.callee.type === 'Identifier' &&
      property.value.callee.name === 'zodResolver',
  );
}

export const zodResolver = defineRule({
  meta: {
    type: 'problem',
    docs: { description: 'Every useForm validates through zodResolver.' },
    messages: { noSchema: 'useForm takes resolver: zodResolver(XSchema), so the type of the form is the type its schema validates.' },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(call) {
        if (call.callee.type !== 'Identifier' || call.callee.name !== 'useForm' || resolvesWithZod(call.arguments[0])) return;
        context.report({ node: call, messageId: 'noSchema' });
      },
    };
  },
});
