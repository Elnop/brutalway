import { defineRule } from '@oxlint/plugins';
import { classNames, classStrings, isClassAttribute } from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { tailwindClass } from '#src/shared-features/tailwind-classes/lib/tailwindClass.ts';

export const noDarkVariant = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'The project is light only: no dark: variant.' },
    messages: { darkVariant: 'The project is light only, so {{name}} never applies: remove the dark: class.' },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(attribute) {
        if (!isClassAttribute(attribute)) return;
        for (const entry of classNames(classStrings(attribute))) {
          if (tailwindClass(entry.name).variants.includes('dark')) context.report({ node: entry.node, messageId: 'darkVariant', data: { name: entry.name } });
        }
      },
    };
  },
});
