import { sharedFolderDocs } from '#src/features/stacks/lib/sharedFolderDocs.ts';
import type { Stack } from '#src/shared/stack/StackTypes.ts';
import { fillAnchors } from '#src/features/stacks/lib/fillAnchors.ts';
import { serverStateExtends } from '#src/features/stacks/lib/serverStateExtends.ts';
import { normalizeTitleChanges } from '#src/features/stacks/lib/normalizeTitleChanges.ts';
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
  FORMS_SCHEMAS_IN_TITLE_FORM,
  FRONTEND_FORMS_EXAMPLE,
  FRONTEND_FORMS_SERVER_STATE,
  FRONTEND_SERVER_STATE,
  FRONTEND_SERVER_STATE_AGENTS,
  FRONTEND_I18N_AND_TESTS,
  FRONTEND_NO_ZUSTAND,
  FRONTEND_SKELETON,
  FRONTEND_TAILWIND,
  FRONTEND_TEST_SWITCHES,
  FRONTEND_UI_AND_STYLING,
  I18N_LOCALE_EDITS,
} from '#src/features/stacks/configs/frontendChangesConfig.ts';
import {
  FRONTEND_NO_I18N,
  FRONTEND_NO_I18N_FORMS,
  FRONTEND_NO_I18N_LINT,
  FRONTEND_NO_I18N_LOOKS,
  WEB_NO_I18N,
} from '#src/features/stacks/configs/frontendNoI18nConfig.ts';

const I18N_README = `The example comes in English and French. The buttons in the header switch between them through \`src/features/language-switch/components/LanguageSwitchContainer.tsx\`, which saves the choice in a \`language\` cookie and asks the server to render the page again. The languages are listed in \`src/features/language-switch/LanguagesConfig.ts\`. On each request, \`src/features/language-switch/lib/requestLanguage.ts\` reads the cookie, or else the first language of the browser that the project has, so the server renders the texts, \`<html lang>\` and the title of the page in that language from the start.

## Add a language

To add a language, add it to \`src/features/language-switch/LanguagesConfig.ts\`, add its folder next to \`locales/en/\`, import its files in \`src/features/i18n/createI18n.ts\` and list it under \`locales\` in \`i18next.config.ts\`.`;

const SERVER_STATE_README = `## API

The todos come from an API. \`src/shared/todos/todosClient.ts\` calls \`/api/todos\` and \`/api/stats\` and parses each response with \`src/shared/todos/TodosSchemas.ts\`, the queries of \`src/features/todo-list/useTodoList.ts\` and \`src/features/todo-stats/useTodoStatsQuery.ts\` cache the answers, and each change invalidates them through \`src/shared/todos/todosKeys.ts\`.

The API is a catch-all route handler of the project in \`src/app/api/\`, which hands each request to \`src/features/todo-api/lib/todoApi.ts\`. It keeps the todos in memory, one list per browser, so a restart of the server starts over. Replace \`src/features/todo-api/\` with your own storage, or point \`src/shared/todos/todosClient.ts\` to another API such as [template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify).

`;

const SERVER_STATE_VERIFICATION =
  "- no `'use server'` and no `'use cache'`, in a file or in a function: the data goes through the API and the cache of TanStack Query (`@brutalway/oxlint-config-next/no-server-functions`)";

const QUERY_PROVIDER_IMPORT =
  "import { QueryProvider } from '@/features/query-client/QueryProvider.tsx';\n";

const REQUEST_LANGUAGE_IMPORT =
  "import { requestLanguage } from '@/features/language-switch/lib/requestLanguage.ts';\n";

const REACT_COMPILER_DOC = `\`next.config.ts\` turns on the [React Compiler](https://react.dev/learn/react-compiler) (\`reactCompiler: true\`, which runs \`babel-plugin-react-compiler\`), so components and hooks are memoized at build time. Vitest runs without it, since its memo caches add branches the tests would have to reach: unit and component tests check the code as written, and the e2e tests run the compiled build. \`oxlint.config.ts\` reports \`useMemo\`, \`useCallback\` and \`memo\` imported from \`react\`.

`;

const ANALYTICS_POSTHOG_README = `## Analytics

\`src/shared/analytics/analyticsTracker.ts\` is the only place where events leave the app: \`analyticsTracker.track('todo_added', { source: 'form' })\` sends them to PostHog through \`posthog-js\`, and dependency-cruiser keeps \`posthog-js\` inside this file. Set \`NEXT_PUBLIC_POSTHOG_KEY\` in \`.env.local\`, which git ignores, and \`NEXT_PUBLIC_POSTHOG_HOST\` for another host than \`https://eu.i.posthog.com\`. Next.js writes both into the client code at build time. Without a key nothing is sent, in dev, in \`next start\` or in the e2e tests, and nothing is sent during server rendering. Autocapture and the scripts PostHog loads from its servers are off, and \`src/proxy.ts\` lets the PostHog hosts through \`connect-src\`.

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
  coverageEntries:
    "          'src/proxy.ts',\n          'src/instrumentation*.ts',\n          '**/request[A-Z]*.ts',\n",
  coverageLeftOut:
    ', `src/app/`, `src/proxy.ts`, the instrumentation files that Next.js loads and the `requestX.ts` files that read the request',
};

export const nextStack: Stack = {
  id: 'next',
  label: 'Next.js + React',
  directory: 'templates/next',
  options: [
    ...FRONTEND_LOOK_OPTIONS,
    {
      id: 'server-state',
      message: 'Read and write the data through an API with TanStack Query?',
      default: false,
    },
    ...FRONTEND_FEATURE_OPTIONS,
  ],
  changes: fillAnchors(
    [
      ...FRONTEND_BASE,
      ...FRONTEND_NO_I18N_LINT,
      ...FRONTEND_SKELETON,
      sharedFolderDocs([
        'AGENTS.md',
        'docs/reference/layout.md',
        'docs/reference/verifications.md',
      ]),
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
      ...FRONTEND_NO_I18N_LOOKS,
      ...FRONTEND_SERVER_STATE,
      {
        when: { 'server-state': true },
        edits: [
          {
            file: 'oxlint.config.ts',
            after: '{{presetImport}}\n',
            insert:
              "import { noServerFunctionsConfig } from '@brutalway/oxlint-config-next/no-server-functions';\n",
          },
          {
            file: 'oxlint.config.ts',
            replace: 'extends: [{{preset}}, tanstackQueryConfig',
            with: 'extends: [{{preset}}, noServerFunctionsConfig, tanstackQueryConfig',
          },
          {
            file: 'docs/concepts/architecture.md',
            replace:
              'the `QueryClient` is created by `src/features/query-client/QueryProvider.tsx`,',
            with: 'the `QueryClient` is created by `src/features/query-client/QueryProvider.tsx`, once in the browser and once per request on the server,',
          },
          {
            file: 'docs/reference/verifications.md',
            replace:
              "- a server action lives in a `.ts` file of its own that starts with `'use server'` and exports one async function",
            with: SERVER_STATE_VERIFICATION,
          },
        ],
      },
      {
        when: { 'server-state': true, i18n: ['en', 'en-fr'] },
        edits: [
          {
            file: 'src/app/layout.tsx',
            after: "import { I18nProvider } from '@/features/i18n/I18nProvider.tsx';\n",
            insert: QUERY_PROVIDER_IMPORT,
          },
          {
            file: 'src/app/layout.tsx',
            replace: '>{children}</I18nProvider>',
            with: '>\n          <QueryProvider>{children}</QueryProvider>\n        </I18nProvider>',
          },
        ],
      },
      {
        when: { 'server-state': true, i18n: 'none' },
        edits: [
          {
            file: 'src/app/layout.tsx',
            after: "import '@/app/globals.css';\n",
            insert: QUERY_PROVIDER_IMPORT,
          },
          {
            file: 'src/app/layout.tsx',
            replace: '<body>{children}</body>',
            with: '<body>\n        <QueryProvider>{children}</QueryProvider>\n      </body>',
          },
        ],
      },
      {
        when: { 'server-state': true, example: true },
        overlay: 'server-state-example',
        remove: [
          'src/shared/todos/useTodos.ts',
          'src/shared/todos/todosStore.ts',
          'src/shared/todos/todosStore.test.ts',
          'src/shared/todos/lib/todosSelectors.ts',
          'src/shared/todos/lib/todosSelectors.test.ts',
        ],
        edits: [
          { file: 'README.md', before: '## Documentation', insert: SERVER_STATE_README },
          {
            file: 'docs/reference/layout.md',
            replace: '`src/shared/todos/` holds the tasks and the current filter,',
            with: '`src/shared/todos/` holds the client of the todo API, its schemas and its mutations,',
          },
          {
            file: 'docs/concepts/architecture.md',
            replace:
              '`src/shared/todos/todosStore.ts` only exports `todosStore` and `todosActions`, `src/shared/todos/lib/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared/todos/useTodos.ts`.',
            with: '`src/features/todo-list/todosStore.ts` only exports `todosStore` and `todosActions`, and `src/features/todo-list/useTodoList.ts` reads it. The store only holds the filter of the list: the todos and the counters come from the API (see Server state below).',
          },
          {
            file: 'docs/concepts/architecture.md',
            replace:
              'The todos stay in a zustand store in the browser, like in template-vite: the example app has no server data. We leave out server actions and route handlers until an app needs them.',
            with: "The todos come from a catch-all route handler in `src/app/api/`, through TanStack Query, like in template-vite with its `server-state` option. Server actions and `'use cache'` are rejected, so the API stays the only way to the data.",
          },
        ],
        addDependencies: { zod: '4.6.7' },
      },
      ...FRONTEND_FORMS,
      ...FRONTEND_FORMS_EXAMPLE,
      ...FRONTEND_NO_I18N_FORMS,
      {
        when: { forms: true, example: true, 'server-state': false },
        ...FORMS_SCHEMAS_IN_TITLE_FORM,
      },
      ...FRONTEND_FORMS_SERVER_STATE,
      ...normalizeTitleChanges(['docs/reference/verifications.md']),
      ...serverStateExtends({
        preset: 'nextConfig',
        serverState: ['noServerFunctionsConfig', 'tanstackQueryConfig'],
      }),
      {
        when: { i18n: 'en-fr' },
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
            after: "import { I18nProvider } from '@/features/i18n/I18nProvider.tsx';\n",
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
            replace: '<I18nProvider>',
            with: '<I18nProvider language={language}>',
          },
          {
            file: 'src/app/page.tsx',
            after: "import { createI18n } from '@/features/i18n/createI18n.ts';\n",
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
              '`src/features/i18n/I18nProvider.tsx` hands an instance to the client components through `useTranslation`, and the server components (`src/app/page.tsx`, the metadata in `src/app/layout.tsx`) call `createI18n().getFixedT()` themselves, since a server component cannot use a hook.',
            with: '`src/features/i18n/I18nProvider.tsx` hands an instance in the language of the request to the client components through `useTranslation`, and the server components (`src/app/page.tsx`, the metadata in `src/app/layout.tsx`) call `createI18n(await requestLanguage()).getFixedT()` themselves, since a server component cannot use a hook.',
          },
          {
            file: 'docs/guides/translations.md',
            replace:
              '## Add a language\n\nTo add a language, add its folder next to `locales/en/`, import its files in `src/features/i18n/createI18n.ts` and list it under `locales` in `i18next.config.ts`.',
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
        when: { 'component-tests': false, example: false },
        remove: ['src/features/i18n/I18nProvider.test.tsx'],
      },
      {
        when: { 'server-state': true, coverage: true },
        edits: [
          {
            file: 'vitest.config.ts',
            after: "          'src/proxy.ts',\n",
            insert: "          'src/features/query-client/QueryProvider.tsx',\n",
          },
          {
            file: 'docs/reference/verifications.md',
            replace: ' and the `requestX.ts` files that read the request are left out',
            with: ', the `requestX.ts` files that read the request and `src/features/query-client/QueryProvider.tsx` are left out',
          },
        ],
      },
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
        when: { 'react-compiler': true, example: true, 'server-state': false },
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
      ...FRONTEND_SERVER_STATE_AGENTS,
      ...FRONTEND_AGENTS_AND_THEME,
      ...FRONTEND_NO_I18N,
      ...WEB_NO_I18N,
      {
        when: { i18n: 'none' },
        edits: [
          {
            file: 'docs/reference/layout.md',
            replace:
              ': the i18n setup is the `src/features/i18n/` feature, and the messages are data, in `locales/` at the root of the project, imported through the `@locales/*` alias.',
            with: '.',
          },
          {
            file: 'docs/reference/verifications.md',
            replace: ', then the i18next config.',
            with: '.',
          },
        ],
      },
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
