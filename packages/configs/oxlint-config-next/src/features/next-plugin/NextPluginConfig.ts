import type { DummyRuleMap } from 'oxlint';

const NEXT_RULES = [
  'google-font-display',
  'google-font-preconnect',
  'inline-script-id',
  'next-script-for-ga',
  'no-assign-module-variable',
  'no-async-client-component',
  'no-before-interactive-script-outside-document',
  'no-css-tags',
  'no-document-import-in-page',
  'no-duplicate-head',
  'no-head-element',
  'no-head-import-in-document',
  'no-html-link-for-pages',
  'no-img-element',
  'no-page-custom-font',
  'no-script-component-in-head',
  'no-styled-jsx-in-document',
  'no-sync-scripts',
  'no-title-in-document-head',
  'no-typos',
  'no-unwanted-polyfillio',
];

export const nextPluginRules: DummyRuleMap = Object.fromEntries(
  NEXT_RULES.map((rule) => [`nextjs/${rule}`, 'error']),
);
