import { defineRule } from '@oxlint/plugins';
import { classNames, classStrings, isClassAttribute } from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { tailwindClass } from '#src/shared-features/tailwind-classes/lib/tailwindClass.ts';

export const noDarkVariant = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'No dark: variant: a theme changes the values of the tokens.' },
    messages: { darkVariant: 'A theme changes the values of the tokens, never a class: remove {{name}}, and give the token its dark value in the stylesheet that declares it.' },
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
