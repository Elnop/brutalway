import type { ESTree } from '@oxlint/plugins';
import { oklab } from '@brutalway/color-utils/oklab';
import { COLOR_LITERAL } from '#src/features/color-tokens/ColorTokensConfig.ts';
import type { Offense, Report } from '#src/features/color-tokens/ColorTokensTypes.ts';

const COLOR_ATTRIBUTES = new Set(['fill', 'stroke', 'color', 'stopColor', 'floodColor', 'lightingColor']);

function literalOffense(text: string): Offense | undefined {
  const literal = COLOR_LITERAL.exec(text)?.[0];
  return literal === undefined ? undefined : { text: literal, color: oklab(literal), format: (token) => `var(--color-${token})` };
}

function styleValues(attribute: ESTree.JSXAttribute): ESTree.Node[] {
  const value = attribute.value;
  if (value?.type !== 'JSXExpressionContainer' || value.expression.type !== 'ObjectExpression') return [];
  return value.expression.properties.flatMap((property) => (property.type === 'Property' ? [property.value] : []));
}

function colorValues(attribute: ESTree.JSXAttribute, name: string): ESTree.Node[] {
  if (name === 'style') return styleValues(attribute);
  return COLOR_ATTRIBUTES.has(name) && attribute.value !== null ? [attribute.value] : [];
}

function staticText(node: ESTree.Node): string | undefined {
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral') return node.quasis.map((quasi) => quasi.value.cooked ?? quasi.value.raw).join(' ');
  if (node.type === 'JSXExpressionContainer' && node.expression.type !== 'JSXEmptyExpression') return staticText(node.expression);
  return undefined;
}

export function reportLiteralOffenses(attribute: ESTree.JSXAttribute, name: string, report: Report): void {
  for (const value of colorValues(attribute, name)) {
    const text = staticText(value);
    const offense = text === undefined ? undefined : literalOffense(text);
    if (offense !== undefined) report(value, offense);
  }
}
