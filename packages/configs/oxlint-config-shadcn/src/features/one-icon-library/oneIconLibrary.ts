import { defineRule } from '@oxlint/plugins';

const OTHER_ICON_SETS =
  /^(react-icons|@heroicons\/|@radix-ui\/react-icons|@tabler\/icons-react|@phosphor-icons\/|phosphor-react|@fortawesome\/|react-feather|@mui\/icons-material|iconoir-react|@remixicon\/react|@hugeicons\/)/u;

export const oneIconLibrary = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'Icons come from lucide-react, the library set in components.json.' },
    messages: {
      otherSet:
        '{{source}} is another icon set: import the icon from lucide-react, the library of components.json, so icons look alike.',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(declaration) {
        const source = declaration.source.value;
        if (!OTHER_ICON_SETS.test(source)) return;
        context.report({ node: declaration.source, messageId: 'otherSet', data: { source } });
      },
    };
  },
});
