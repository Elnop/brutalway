import type { StackChange } from '#src/shared-features/stack/StackTypes.ts';

export const TEMPLATE_ONLY_DOCS: StackChange = {
  when: {},
  remove: ['docs/reference/options.md'],
  edits: [
    { file: 'README.md', dropSection: '## Create a project from it' },
    { file: 'README.md', dropLines: '- [Options](docs/reference/options.md)' },
  ],
};
