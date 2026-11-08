import type { DocLinksSettings } from './DocLinksTypes.ts';

export const DEFAULT_SETTINGS: DocLinksSettings = {
  include: ['**/*.md'],
  ignore: ['**/node_modules/**', '**/dist/**', '**/CHANGELOG.md'],
  skip: ['^https?://(localhost|127\\.0\\.0\\.1)([:/]|$)', '^https?://([^/]+\\.)?example\\.(com|org|net)([:/]|$)'],
};

export const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const REQUEST_TIMEOUT_MS = 10_000;

export const ONLINE_PROBE_URL = 'https://registry.npmjs.org/';

export const CONCURRENCY = 8;
