import type { DocLengthSettings } from '#src/shared-features/docs/DocLengthTypes.ts';

export const DEFAULT_SETTINGS: DocLengthSettings = {
  maxLines: 300,
  fileDepth: 2,
  include: ['**/*.md'],
  ignore: ['**/node_modules/**', '**/dist/**', '**/CHANGELOG.md'],
  indexName: 'README.md',
  orderPrefix: false,
};
