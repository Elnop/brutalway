import type { ESTree } from '@oxlint/plugins';
import type { ClassString } from './TailwindTypes.ts';

const CLASS_ATTRIBUTES = new Set(['className', 'class']);

function stringsIn(node: ESTree.Node | null | undefined): ClassString[] {
  if (node === null || node === undefined) return [];
  if (node.type === 'Literal') return typeof node.value === 'string' ? [{ node, text: node.value }] : [];
  if (node.type === 'TemplateLiteral') return node.quasis.map((quasi) => ({ node, text: quasi.value.cooked ?? quasi.value.raw }));
  if (node.type === 'ConditionalExpression') return [...stringsIn(node.consequent), ...stringsIn(node.alternate)];
  if (node.type === 'LogicalExpression') return [...stringsIn(node.left), ...stringsIn(node.right)];
  if (node.type === 'CallExpression') return node.arguments.flatMap((argument) => stringsIn(argument));
  if (node.type === 'ArrayExpression') return node.elements.flatMap((element) => stringsIn(element));
  if (node.type === 'ObjectExpression') return node.properties.flatMap((property) => (property.type === 'Property' ? stringsIn(property.key) : []));
  if (node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression' || node.type === 'ParenthesizedExpression') return stringsIn(node.expression);
  if (node.type === 'JSXExpressionContainer') return node.expression.type === 'JSXEmptyExpression' ? [] : stringsIn(node.expression);
  return [];
}

export function isClassAttribute(attribute: ESTree.JSXAttribute): boolean {
  return attribute.name.type === 'JSXIdentifier' && CLASS_ATTRIBUTES.has(attribute.name.name);
}

export function classStrings(attribute: ESTree.JSXAttribute): ClassString[] {
  return stringsIn(attribute.value);
}

export function classNames(strings: ClassString[]): { node: ESTree.Node; name: string }[] {
  return strings.flatMap(({ node, text }) =>
    text
      .split(/\s+/u)
      .filter(Boolean)
      .map((name) => ({ node, name })),
  );
}
