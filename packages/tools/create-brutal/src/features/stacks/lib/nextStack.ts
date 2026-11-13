import type { Stack } from '#src/shared-features/stack/StackTypes.ts';
import { normalizeTitleChanges } from '#src/features/stacks/lib/normalizeTitleChanges.ts';
import { fillAnchors } from '#src/features/stacks/lib/fillAnchors.ts';
import {
  FRONTEND_FEATURE_OPTIONS,
  FRONTEND_LOOK_OPTIONS,
  FRONTEND_AGENTS_AND_THEME,
  FRONTEND_ANALYTICS,
  FRONTEND_ANALYTICS_AND_AGENTS,
  FRONTEND_BASE,
  FRONTEND_COMPILER,
  FRONTEND_E2E_AND_REPOSITORY,
  FRONTEND_FORMS,
  FRONTEND_FORMS_EXAMPLE,
  FRONTEND_I18N_AND_TESTS,
  FRONTEND_NO_ZUSTAND,
  FRONTEND_SKELETON,
  FRONTEND_TAILWIND,
  FRONTEND_TEST_SWITCHES,
  FRONTEND_UI_AND_STYLING,
  I18N_LOCALE_EDITS,
} from '#src/features/stacks/configs/frontendChangesConfig.ts';

const I18N_README = `The example comes in English and French. The buttons in the header switch between them through \`src/features/language-switch/components/LanguageSwitchContainer.tsx\`, which saves the choice in a \`language\` cookie and asks the server to render the page again. The languages are listed in \`src/features/language-switch/LanguagesConfig.ts\`. On each request, \`src/features/language-switch/lib/requestLanguage.ts\` reads the cookie, or else the first language of the browser that the project has, so the server renders the texts, \`<html lang>\` and the title of the page in that language from the start.

## Add a language

To add a language, add it to \`src/features/language-switch/LanguagesConfig.ts\`, add its folder next to \`src/app/locales/en/\`, import its files in \`src/app/createI18n.ts\` and list it under \`locales\` in \`i18next.config.ts\`.`;

const REQUEST_LANGUAGE_IMPORT =
  "import { requestLanguage } from '@/features/language-switch/lib/requestLanguage.ts';\n";

const REACT_COMPILER_DOC = `\`next.config.ts\` turns on the [React Compiler](https://react.dev/learn/react-compiler) (\`reactCompiler: true\`, which runs \`babel-plugin-react-compiler\`), so components and hooks are memoized at build time. Vitest runs without it, since its memo caches add branches the tests would have to reach: unit and component tests check the code as written, and the e2e tests run the compiled build. \`oxlint.config.ts\` reports \`useMemo\`, \`useCallback\` and \`memo\` imported from \`react\`.

`;

const ANALYTICS_POSTHOG_README = `## Analytics

\`src/shared/analyticsClient.ts\` is the only place where events leave the app: \`analyticsClient.track('todo_added', { source: 'form' })\` sends them to PostHog through \`posthog-js\`, and dependency-cruiser keeps \`posthog-js\` inside this file. Set \`NEXT_PUBLIC_POSTHOG_KEY\` in \`.env.local\`, which git ignores, and \`NEXT_PUBLIC_POSTHOG_HOST\` for another host than \`https://eu.i.posthog.com\`. Next.js writes both into the client code at build time. Without a key nothing is sent, in dev, in \`next start\` or in the e2e tests, and nothing is sent during server rendering. Autocapture and the scripts PostHog loads from its servers are off, and \`src/proxy.ts\` lets the PostHog hosts through \`connect-src\`.

`;

const ANCHORS = {
  template: 'next',
  preset: 'nextConfig',
  presetImport: "import { nextConfig } from '@brutalway/oxlint-config-next';",
  aliasFile: 'vitest.config.ts',
  ignorePatterns: "'.next', 'next-env.d.ts'",
  cspFile: 'src/proxy.ts',
  lint: 'oxlint --type-aware src test-utils e2e oxlint.config.ts next.config.ts vitest.config.ts vitest.setup.ts playwright.config.ts i18next.config.ts',
  lintWithoutE2e:
    'oxlint --type-aware src test-utils oxlint.config.ts next.config.ts vitest.config.ts vitest.setup.ts i18next.config.ts',
  testsLintLine:
    '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)',
  coverageEntries: "          'src/proxy.ts',\n          '**/request[A-Z]*.ts',\n",
  coverageLeftOut: ', `src/app/`, `src/proxy.ts` and the `requestX.ts` files that read the request',
};

export const nextStack: Stack = {
  id: 'next',
  label: 'Next.js + React',
  directory: 'templates/next',
  options: [...FRONTEND_LOOK_OPTIONS, ...FRONTEND_FEATURE_OPTIONS],
  changes: fillAnchors(
    [
      ...FRONTEND_BASE,
      ...FRONTEND_SKELETON,
      {
        when: { example: false },
        edits: [
          {
            file: 'docs/concepts/architecture.md',
            replace:
              'goes on the orchestrators that read a store: `src/features/todo-list/components/TodoListLayout.tsx` and `src/features/todo-stats/components/TodoStatsContainer.tsx`.',
            with: 'goes on the orchestrators that read a store.',
          },
          {
            file: 'docs/concepts/architecture.md',
            replace:
              'The todos stay in a zustand store in the browser, like in template-vite: the example app has no server data.',
            with: 'State lives in zustand stores in the browser, like in template-vite.',
          },
        ],
      },
      ...FRONTEND_TAILWIND,
      {
        when: { styling: 'tailwind' },
        addDevDependencies: { '@tailwindcss/postcss': '4.3.5' },
      },
      ...FRONTEND_UI_AND_STYLING,
      ...FRONTEND_FORMS,
      ...FRONTEND_FORMS_EXAMPLE,
      {
        when: { forms: true, example: true },
        overlay: 'forms-schemas',
      },
      ...normalizeTitleChanges(['docs/reference/verifications.md'], false),
      {
        when: { i18n: true },
        overlay: 'i18n',
        edits: [
          ...I18N_LOCALE_EDITS,
          {
            file: 'src/app/layout.tsx',
            replace: "import { connection } from 'next/server';\n",
            with: '',
          },
          {
            file: 'src/app/layout.tsx',
            after: "import { I18nProvider } from '@/app/I18nProvider.tsx';\n",
            insert: REQUEST_LANGUAGE_IMPORT,
          },
          {
            file: 'src/app/layout.tsx',
            replace:
              "export function generateMetadata(): Metadata {\n  const t = createI18n().getFixedT(null, 'app');",
            with: "export async function generateMetadata(): Promise<Metadata> {\n  const t = createI18n(await requestLanguage()).getFixedT(null, 'app');",
          },
          {
            file: 'src/app/layout.tsx',
            replace: '  await connection();\n  return (\n    <html lang="en">',
            with: '  const language = await requestLanguage();\n  return (\n    <html lang={language}>',
          },
          {
            file: 'src/app/layout.tsx',
            replace: '<I18nProvider>{children}</I18nProvider>',
            with: '<I18nProvider language={language}>{children}</I18nProvider>',
          },
          {
            file: 'src/app/page.tsx',
            after: "import { createI18n } from '@/app/createI18n.ts';\n",
            insert: `${REQUEST_LANGUAGE_IMPORT}import { LanguageSwitchContainer } from '@/features/language-switch/components/LanguageSwitchContainer.tsx';\n`,
          },
          {
            file: 'src/app/page.tsx',
            replace:
              "export default function Home() {\n  const t = createI18n().getFixedT(null, 'app');",
            with: "export default async function Home() {\n  const t = createI18n(await requestLanguage()).getFixedT(null, 'app');",
          },
          {
            file: 'src/app/page.tsx',
            before: '      </header>',
            insert: '        <LanguageSwitchContainer />\n',
          },
          {
            file: 'docs/reference/verifications.md',
            replace:
              'so `src/app/layout.tsx` calls `connection()` and every page renders on request',
            with: 'so every page renders on request (`src/app/layout.tsx` reads the language cookie)',
          },
          {
            file: 'docs/guides/translations.md',
            replace:
              '`src/app/I18nProvider.tsx` hands an instance to the client components through `useTranslation`, and the server components (`src/app/page.tsx`, the metadata in `src/app/layout.tsx`) call `createI18n().getFixedT()` themselves, since a server component cannot use a hook.',
            with: '`src/app/I18nProvider.tsx` hands an instance in the language of the request to the client components through `useTranslation`, and the server components (`src/app/page.tsx`, the metadata in `src/app/layout.tsx`) call `createI18n(await requestLanguage()).getFixedT()` themselves, since a server component cannot use a hook.',
          },
          {
            file: 'docs/guides/translations.md',
            replace:
              '## Add a language\n\nTo add a language, add its folder next to `src/app/locales/en/`, import its files in `src/app/createI18n.ts` and list it under `locales` in `i18next.config.ts`.',
            with: I18N_README,
          },
        ],
      },
      ...FRONTEND_I18N_AND_TESTS,
      ...FRONTEND_NO_ZUSTAND,
      {
        when: { zustand: false },
        edits: [{ file: 'docs/concepts/architecture.md', dropLines: 'like in template-vite.' }],
      },
      ...FRONTEND_TEST_SWITCHES,
      {
        when: { e2e: false },
        edits: [
          {
            file: 'docs/reference/verifications.md',
            replace:
              '`npm run e2e` runs against `next start`, so the tests run under these headers. `test` from `@brutalway/playwright-fixtures` fails a test when the browser reports a CSP violation, so a script or a request from another origin shows up there first: allow it',
            with: 'A script or a request from another origin is refused: allow it',
          },
        ],
      },
      ...FRONTEND_E2E_AND_REPOSITORY,
      ...FRONTEND_COMPILER,
      {
        when: { 'react-compiler': true },
        edits: [
          {
            file: 'next.config.ts',
            after: '  poweredByHeader: false,\n',
            insert: '  reactCompiler: true,\n',
          },
          {
            file: 'docs/reference/verifications.md',
            before: '## Dependencies',
            insert: REACT_COMPILER_DOC,
          },
          {
            file: 'knip.json',
            replace: '"ignoreDependencies": [\n    "@swc/core",\n',
            with: '"ignoreDependencies": [\n    "@swc/core",\n    "babel-plugin-react-compiler",\n',
          },
        ],
        addDevDependencies: { 'babel-plugin-react-compiler': '1.0.0' },
      },
      {
        when: { 'react-compiler': true, example: true },
        edits: [
          {
            file: 'src/features/todo-list/useTodoList.ts',
            replace: "import { useMemo } from 'react';\n",
            with: '',
          },
          {
            file: 'src/features/todo-list/useTodoList.ts',
            replace:
              'const todos = useMemo(() => selectVisibleTodos({ todos: allTodos, filter }), [allTodos, filter]);',
            with: 'const todos = selectVisibleTodos({ todos: allTodos, filter });',
          },
        ],
      },
      ...FRONTEND_ANALYTICS,
      {
        when: { analytics: 'posthog' },
        edits: [
          { file: 'README.md', before: '## Documentation', insert: ANALYTICS_POSTHOG_README },
        ],
      },
      ...FRONTEND_ANALYTICS_AND_AGENTS,
      { when: { analytics: 'module' }, overlay: 'analytics-home' },
      { when: { analytics: 'posthog' }, overlay: 'analytics-home' },
      ...FRONTEND_AGENTS_AND_THEME,
    ],
    ANCHORS,
  ),
  nextSteps: (answers) => [
    ...(answers['e2e'] || answers['component-tests']
      ? ['npx playwright install --only-shell chromium']
      : []),
    'npm run dev',
  ],
};
