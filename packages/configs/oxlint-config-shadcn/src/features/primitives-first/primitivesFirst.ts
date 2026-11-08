import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

type Primitive = { component: string; file: string };

const BY_TAG: Record<string, Primitive> = {
  button: { component: 'Button', file: 'button' },
  select: { component: 'Select', file: 'select' },
  textarea: { component: 'Textarea', file: 'textarea' },
};

const BY_INPUT_TYPE: Record<string, Primitive> = {
  checkbox: { component: 'Checkbox', file: 'checkbox' },
  radio: { component: 'RadioGroup', file: 'radio-group' },
};

const INPUT: Primitive = { component: 'Input', file: 'input' };

function inputType(element: ESTree.JSXOpeningElement): string | undefined {
  for (const attribute of element.attributes) {
    if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier' || attribute.name.name !== 'type') continue;
    return attribute.value?.type === 'Literal' && typeof attribute.value.value === 'string' ? attribute.value.value : undefined;
  }
  return undefined;
}

function primitiveFor(element: ESTree.JSXOpeningElement): Primitive | undefined {
  if (element.name.type !== 'JSXIdentifier') return undefined;
  const tag = element.name.name;
  if (tag !== 'input') return BY_TAG[tag];
  const type = inputType(element);
  if (type === 'hidden') return undefined;
  return (type === undefined ? undefined : BY_INPUT_TYPE[type]) ?? INPUT;
}

export const primitivesFirst = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'Controls come from the shadcn/ui primitives, not from raw elements.' },
    messages: {
      raw: '<{{tag}}> is a raw control: use {{component}} from @third-party/shadcn/{{file}}, so every control behaves the same way. If third-party/shadcn/ has no {{file}}.tsx yet, run npx shadcn add {{file}}.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(element) {
        const primitive = primitiveFor(element);
        if (primitive === undefined || element.name.type !== 'JSXIdentifier') return;
        context.report({ node: element, messageId: 'raw', data: { tag: element.name.name, ...primitive } });
      },
    };
  },
});
