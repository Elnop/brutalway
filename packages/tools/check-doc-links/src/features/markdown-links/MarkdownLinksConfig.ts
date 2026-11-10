import type { DocLinksSettings } from '#src/features/markdown-links/MarkdownLinksTypes.ts';

export const DEFAULT_SETTINGS: DocLinksSettings = {
  include: ['**/*.md'],
  ignore: ['**/node_modules/**', '**/dist/**', '**/CHANGELOG.md'],
  skip: [
    '^https?://(localhost|127\\.0\\.0\\.1)([:/]|$)',
    '^https?://([^/]+\\.)?example\\.(com|org|net)([:/]|$)',
  ],
};
