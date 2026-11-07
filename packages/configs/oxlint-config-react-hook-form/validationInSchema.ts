import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

function calleeName(callee: ESTree.Node): string | undefined {
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') return callee.property.name;
  return undefined;
}

const MESSAGE = 'Validation lives in the Zod schema of the form: move this rule into it, so there is one place to read what a field accepts.';

export const validationInSchema = defineRule({
  meta: {
    type: 'problem',
    docs: { description: 'No validation passed to register, useController or a Controller.' },
    messages: { outsideSchema: MESSAGE },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(call) {
        const name = calleeName(call.callee);
        if (name === 'register' && call.arguments.length > 1) context.report({ node: call.arguments[1] ?? call, messageId: 'outsideSchema' });
        if (name !== 'useController') return;
        const [options] = call.arguments;
        if (options?.type !== 'ObjectExpression') return;
        for (const property of options.properties) {
          if (property.type === 'Property' && property.key.type === 'Identifier' && property.key.name === 'rules') context.report({ node: property, messageId: 'outsideSchema' });
        }
      },
      JSXAttribute(attribute) {
        const element = attribute.parent;
        if (attribute.name.type !== 'JSXIdentifier' || attribute.name.name !== 'rules') return;
        if (element.type !== 'JSXOpeningElement' || element.name.type !== 'JSXIdentifier' || element.name.name !== 'Controller') return;
        context.report({ node: attribute, messageId: 'outsideSchema' });
      },
    };
  },
});
