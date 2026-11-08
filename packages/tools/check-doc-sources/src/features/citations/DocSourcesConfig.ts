import type { DocSourcesSettings } from '#src/features/citations/DocSourcesTypes.ts';

export const DEFAULT_SETTINGS: DocSourcesSettings = {
  include: ['**/*.md'],
  ignore: ['**/node_modules/**', '**/dist/**', '**/CHANGELOG.md'],
  ignoreSources: ['**/package.json', '**/package-lock.json'],
};
