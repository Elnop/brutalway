import { defineRule } from '@oxlint/plugins';
import { classNames, classStrings, isClassAttribute } from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { tailwindClass } from '#src/shared-features/tailwind-classes/lib/tailwindClass.ts';

const ROLES = new Map([
  ['h1', 'font-display'],
  ['h2', 'font-display'],
  ['h3', 'font-display'],
  ['code', 'font-mono'],
  ['pre', 'font-mono'],
]);

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
        const attribute = element.attributes.find((candidate) => candidate.type === 'JSXAttribute' && isClassAttribute(candidate));
        const strings = attribute?.type === 'JSXAttribute' ? classStrings(attribute) : [];
        if (attribute?.type === 'JSXAttribute' && attribute.value?.type === 'JSXExpressionContainer' && strings.length === 0) return;
        if (element.attributes.some((candidate) => candidate.type === 'JSXSpreadAttribute') && attribute === undefined) return;
        if (classNames(strings).some((entry) => tailwindClass(entry.name).utility === font)) return;
        context.report({ node: element, messageId: 'missingFont', data: { tag, font } });
      },
    };
  },
});
