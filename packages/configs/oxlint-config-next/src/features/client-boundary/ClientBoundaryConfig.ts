import type { OxlintOverride } from 'oxlint';

const USE_CLIENT = 'ExpressionStatement[directive="use client"]';

const USE_CLIENT_PLACEMENT = {
  selector: `Program > ${USE_CLIENT}`,
  message:
    "'use client' goes on an orchestrator (XContainer, XLayout, XPage), a provider (XProvider) or an error.tsx: a presenter, a hook or a shared/ file becomes client code through the orchestrator that renders it.",
};

const CLIENT_READS_API = {
  selector: `Program:has(> ${USE_CLIENT}) > ImportDeclaration[source.value=/(?<!\\/analytics)Client(\\.ts)?$/u]`,
  message:
    'A client component does not call an API client: read the data in a server component (page.tsx, layout.tsx) and pass it down as a prop. analyticsClient.ts is the exception, since events happen in the browser.',
};

const CLIENT_FILES = [
  '**/*Container.tsx',
  '**/*Layout.tsx',
  '**/*Page.tsx',
  '**/*Provider.tsx',
  '**/app/**/error.tsx',
  '**/app/**/global-error.tsx',
];

export const clientBoundaryOverrides: OxlintOverride[] = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'client-boundary/no-restricted-syntax': ['error', USE_CLIENT_PLACEMENT, CLIENT_READS_API],
    },
  },
  {
    files: CLIENT_FILES,
    rules: { 'client-boundary/no-restricted-syntax': ['error', CLIENT_READS_API] },
  },
  {
    files: ['**/shared/**', '**/presenters/**'],
    rules: {
      'client-boundary/no-restricted-syntax': ['error', USE_CLIENT_PLACEMENT, CLIENT_READS_API],
    },
  },
];
