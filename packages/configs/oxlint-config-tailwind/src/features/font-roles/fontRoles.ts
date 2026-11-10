import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';
import {
  classNames,
  classStrings,
  isClassAttribute,
} from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { tailwindClass } from '#src/shared-features/tailwind-classes/lib/tailwindClass.ts';

const ROLES = new Map([
  ['h1', 'font-display'],
  ['h2', 'font-display'],
  ['h3', 'font-display'],
  ['code', 'font-mono'],
  ['pre', 'font-mono'],
]);

function classAttribute(element: ESTree.JSXOpeningElement): ESTree.JSXAttribute | undefined {
  const attribute = element.attributes.find(
    (candidate) => candidate.type === 'JSXAttribute' && isClassAttribute(candidate),
  );
  return attribute?.type === 'JSXAttribute' ? attribute : undefined;
}

function hasFont(element: ESTree.JSXOpeningElement, font: string): boolean {
  const attribute = classAttribute(element);
  const strings = attribute === undefined ? [] : classStrings(attribute);
  if (attribute?.value?.type === 'JSXExpressionContainer' && strings.length === 0) return true;
  const spread = element.attributes.some((candidate) => candidate.type === 'JSXSpreadAttribute');
  if (spread && attribute === undefined) return true;
  return classNames(strings).some((entry) => tailwindClass(entry.name).utility === font);
}

export const fontRoles = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'h1 to h3 take font-display, code and pre take font-mono.' },
    messages: { missingFont: '<{{tag}}> takes the {{font}} class: add it to its className.' },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(element) {
        if (element.name.type !== 'JSXIdentifier') return;
        const tag = element.name.name;
        const font = ROLES.get(tag);
        if (font === undefined) return;
        if (hasFont(element, font)) return;
        context.report({ node: element, messageId: 'missingFont', data: { tag, font } });
      },
    };
  },
});
