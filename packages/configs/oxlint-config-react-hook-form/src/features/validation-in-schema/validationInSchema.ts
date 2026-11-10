import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

function calleeName(callee: ESTree.Node): string | undefined {
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
    return callee.property.name;
  }
  return undefined;
}

function isRulesProperty(property: ESTree.ObjectPropertyKind): boolean {
  return (
    property.type === 'Property' &&
    property.key.type === 'Identifier' &&
    property.key.name === 'rules'
  );
}

function validationOutsideSchema(call: ESTree.CallExpression): ESTree.Node[] {
  const name = calleeName(call.callee);
  if (name === 'register') return call.arguments.length > 1 ? [call.arguments[1] ?? call] : [];
  if (name !== 'useController') return [];
  const [options] = call.arguments;
  if (options?.type !== 'ObjectExpression') return [];
  return options.properties.filter((property) => isRulesProperty(property));
}

function isControllerRules(attribute: ESTree.JSXAttribute): boolean {
  const element = attribute.parent;
  return (
    attribute.name.type === 'JSXIdentifier' &&
    attribute.name.name === 'rules' &&
    element.type === 'JSXOpeningElement' &&
    element.name.type === 'JSXIdentifier' &&
    element.name.name === 'Controller'
  );
}

const MESSAGE =
  'Validation lives in the Zod schema of the form: move this rule into it, so there is one place to read what a field accepts.';

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
        for (const node of validationOutsideSchema(call)) {
          context.report({ node, messageId: 'outsideSchema' });
        }
      },
      JSXAttribute(attribute) {
        if (isControllerRules(attribute)) {
          context.report({ node: attribute, messageId: 'outsideSchema' });
        }
      },
    };
  },
});
