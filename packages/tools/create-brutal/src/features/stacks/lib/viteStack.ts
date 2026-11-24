import { sharedFolderDocs } from '#src/features/stacks/lib/sharedFolderDocs.ts';
import { FRONTEND_NO_UNIT_TESTS } from '#src/features/stacks/configs/noUnitTestsConfig.ts';
import type { FileEdit, Stack, StackChange } from '#src/shared/stack/StackTypes.ts';
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
  FORMS_SCHEMAS_IN_TITLE_FORM,
  FRONTEND_FORMS_EXAMPLE,
  FRONTEND_I18N_AND_TESTS,
  FRONTEND_NO_ZUSTAND,
  FRONTEND_SKELETON,
  FRONTEND_TAILWIND,
  FRONTEND_TEST_SWITCHES,
  FRONTEND_UI_AND_STYLING,
  FRONTEND_COMPILER_EXAMPLE,
  FRONTEND_FORMS_SERVER_STATE,
  FRONTEND_SERVER_STATE,
  FRONTEND_SERVER_STATE_AGENTS,
  I18N_LOCALE_EDITS,
} from '#src/features/stacks/configs/frontendChangesConfig.ts';
import {
  FRONTEND_NO_I18N,
  FRONTEND_NO_I18N_FORMS,
  FRONTEND_NO_I18N_LINT,
  FRONTEND_NO_I18N_LOOKS,
  WEB_NO_I18N,
} from '#src/features/stacks/configs/frontendNoI18nConfig.ts';
import { serverStateExtends } from '#src/features/stacks/lib/serverStateExtends.ts';

const SERVER_STATE_README = `## API

The todos come from an API. \`src/shared/todos/todosClient.ts\` calls \`/api/todos\` and \`/api/stats\` and parses each response with \`src/shared/todos/TodosSchemas.ts\`, the queries of \`src/features/todo-list/useTodoList.ts\` and \`src/features/todo-stats/useTodoStatsQuery.ts\` cache the answers, and each change invalidates them through \`src/shared/todos/todosKeys.ts\`.

Without \`API_URL\`, \`devApi.ts\` answers these routes from an in-memory list, in \`npm run dev\` and in the \`vite preview\` the e2e tests run against, with one list per browser. To use [template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify) instead, start it and run \`API_URL=http://localhost:3000 npm run dev\`: \`/api\` is then proxied to it. In production, serve the API under \`/api\` next to the built files.

`;

const I18N_README = `The example comes in English and French. The buttons in the header switch between them through \`src/features/language-switch/LanguageSwitchContainer.tsx\`, the languages are listed in \`src/features/language-switch/LanguagesConfig.ts\`, and \`src/features/language-switch/languageStorage.ts\` starts from the language saved in \`localStorage\`, or else the first one of the browser that the project has, and keeps \`<html lang>\` and the title of the page in line with it.

## Add a language

To add a language, add it to \`src/features/language-switch/LanguagesConfig.ts\`, add its folder next to \`locales/en/\`, import its files in \`src/features/i18n/createI18n.ts\` and list it under \`locales\` in \`i18next.config.ts\`.`;

const REACT_COMPILER_PLUGINS = `const reactCompiler =
  process.env['VITEST'] === undefined ? [babel({ presets: [reactCompilerPreset()] })] : [];

`;

const REACT_COMPILER_DOC = `\`vite.config.ts\` runs the [React Compiler](https://react.dev/learn/react-compiler) through Babel (\`babel-plugin-react-compiler\`, \`reactCompilerPreset()\` of \`@vitejs/plugin-react\`), so components and hooks are memoized at build time. Vitest runs without it, since its memo caches add branches the tests would have to reach: unit and component tests check the code as written, and the e2e tests run the compiled build. \`oxlint.config.ts\` reports \`useMemo\`, \`useCallback\` and \`memo\` imported from \`react\`.

`;

const ANALYTICS_POSTHOG_README = `## Analytics

\`src/shared/analytics/analyticsTracker.ts\` is the only place where events leave the app: \`analyticsTracker.track('todo_added', { source: 'form' })\` sends them to PostHog through \`posthog-js\`, and dependency-cruiser keeps \`posthog-js\` inside this file. Set \`VITE_POSTHOG_KEY\` in \`.env.local\`, which git ignores, and \`VITE_POSTHOG_HOST\` for another host than \`https://eu.i.posthog.com\`. Without a key nothing is sent, in dev, in preview or in the e2e tests. Autocapture and the scripts PostHog loads from its servers are off, and \`securityHeaders.ts\` lets the PostHog hosts through \`connect-src\`.

`;

const ANALYTICS_IMPORT =
  "import { analyticsTracker } from '@/shared/analytics/analyticsTracker.ts';\n";

const APP_OPENED_IMPORTS: StackChange[] = [
  {
    when: { analytics: ['module', 'posthog'], i18n: ['en', 'en-fr'] },
    edits: [
      {
        file: 'src/main.tsx',
        after: "import { createI18n } from '@/features/i18n/createI18n.ts';\n",
        insert: ANALYTICS_IMPORT,
      },
    ],
  },
  {
    when: { analytics: ['module', 'posthog'], i18n: 'none' },
    edits: [
      {
        file: 'src/main.tsx',
        after: "import { App } from '@/app/App.tsx';\n",
        insert: ANALYTICS_IMPORT,
      },
    ],
  },
];

const APP_OPENED: FileEdit[] = [
  {
    file: 'src/main.tsx',
    after: '  </StrictMode>,\n);\n',
    insert: "\nanalyticsTracker.track('app_opened');\n",
  },
];

const ANCHORS = {
  template: 'vite',
  preset: 'reactViteConfig',
  presetImport: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';",
  aliasFile: 'vite.config.ts',
  ignorePatterns: "'dist'",
  cspFile: 'securityHeaders.ts',
  lint: 'oxlint --type-aware src test oxlint.config.ts vite.config.ts vitest.config.ts vitest.setup.ts playwright.config.ts i18next.config.ts securityHeaders.ts',
  lintWithoutE2e:
    'oxlint --type-aware src test oxlint.config.ts vite.config.ts vitest.config.ts vitest.setup.ts i18next.config.ts securityHeaders.ts',
  testsLintLine:
    '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)',
  coverageEntries: "          'src/main.tsx',\n",
  coverageLeftOut: ' and `src/app/`',
};

export const viteStack: Stack = {
  id: 'vite',
  label: 'Vite + React',
  directory: 'templates/vite',
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
            file: 'index.html',
            replace: '<title>Todos</title>',
            with: '<title>__PROJECT_NAME__</title>',
          },
        ],
      },
      ...FRONTEND_TAILWIND,
      {
        when: { styling: 'tailwind' },
        edits: [
          {
            file: 'vite.config.ts',
            after: "import react from '@vitejs/plugin-react';\n",
            insert: "import tailwindcss from '@tailwindcss/vite';\n",
          },
          {
            file: 'vite.config.ts',
            replace: 'plugins: [react()',
            with: 'plugins: [react(), tailwindcss()',
          },
        ],
        addDevDependencies: { '@tailwindcss/vite': '4.3.5' },
      },
      ...FRONTEND_UI_AND_STYLING,
      ...FRONTEND_NO_I18N_LOOKS,
      ...FRONTEND_SERVER_STATE,
      { when: { 'server-state': true, i18n: 'none' }, overlay: 'no-i18n-server-state' },
      {
        when: { 'server-state': true, example: true },
        overlay: 'server-state-example',
        remove: [
          'src/shared/todos/useTodos.ts',
          'src/shared/todos/todosStore.ts',
          'src/shared/todos/lib/todosSelectors.ts',
        ],
        edits: [
          {
            file: 'vite.config.ts',
            after: "import react from '@vitejs/plugin-react';\n",
            insert: "import { devApi } from './devApi.ts';\n",
          },
          {
            file: 'vite.config.ts',
            replace: 'plugins: [react()',
            with: 'plugins: [react(), devApi()',
          },
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
      ...serverStateExtends({ preset: 'reactViteConfig', serverState: ['tanstackQueryConfig'] }),
      {
        when: { i18n: 'en-fr' },
        overlay: 'i18n',
        edits: [
          ...I18N_LOCALE_EDITS,
          {
            file: 'src/main.tsx',
            after: "import { createI18n } from '@/features/i18n/createI18n.ts';\n",
            insert:
              "import { followLanguage, preferredLanguage } from '@/features/language-switch/languageStorage.ts';\n",
          },
          {
            file: 'src/main.tsx',
            replace: 'const i18n = createI18n();',
            with: 'const i18n = createI18n(preferredLanguage());\nfollowLanguage(i18n);',
          },
          {
            file: 'src/app/App.tsx',
            after: "import { useTranslation } from 'react-i18next';\n",
            insert:
              "import { LanguageSwitchContainer } from '@/features/language-switch/LanguageSwitchContainer.tsx';\n",
          },
          {
            file: 'src/app/App.tsx',
            before: '      </header>',
            insert: '        <LanguageSwitchContainer />\n',
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
      ...FRONTEND_TEST_SWITCHES,
      {
        when: { e2e: false },
        edits: [
          {
            file: 'docs/reference/verifications.md',
            replace: '`vite preview` sends them, so the e2e tests run under them, and',
            with: '`vite preview` sends them, and',
          },
          {
            file: 'docs/reference/verifications.md',
            replace:
              '`test` from `@brutalway/playwright-fixtures` fails a test when the browser reports a CSP violation, so a script or a request from another origin shows up there first: allow it',
            with: 'A script or a request from another origin is then refused: allow it',
          },
        ],
      },
      ...FRONTEND_E2E_AND_REPOSITORY,
      {
        when: { 'server-state': true, example: true },
        edits: [
          {
            file: 'package.json',
            replace: 'oxlint.config.ts vite.config.ts',
            with: 'oxlint.config.ts vite.config.ts devApi.ts devApiRoutes.ts',
          },
          {
            file: 'tsconfig.test.json',
            replace: '"vite.config.ts",',
            with: '"vite.config.ts", "devApi.ts", "devApiRoutes.ts",',
          },
          {
            file: 'oxlint.config.ts',
            replace: "files: ['*.config.ts']",
            with: "files: ['*.config.ts', 'devApi.ts']",
          },
        ],
      },
      ...FRONTEND_COMPILER,
      {
        when: { 'react-compiler': true },
        edits: [
          {
            file: 'vite.config.ts',
            replace: "import react from '@vitejs/plugin-react';\n",
            with: "import babel from '@rolldown/plugin-babel';\nimport react, { reactCompilerPreset } from '@vitejs/plugin-react';\n",
          },
          {
            file: 'vite.config.ts',
            before: 'export default defineConfig({',
            insert: REACT_COMPILER_PLUGINS,
          },
          {
            file: 'vite.config.ts',
            replace: 'plugins: [react()',
            with: 'plugins: [react(), ...reactCompiler',
          },
          {
            file: 'docs/reference/verifications.md',
            before: '## Dependencies',
            insert: REACT_COMPILER_DOC,
          },
          {
            file: 'knip.json',
            replace: '"ignoreDependencies": [\n    "@swc/core",\n',
            with: '"ignoreDependencies": [\n    "@swc/core",\n    "@babel/core",\n    "babel-plugin-react-compiler",\n',
          },
        ],
        addDevDependencies: {
          '@babel/core': '8.1.0',
          '@rolldown/plugin-babel': '0.3.0',
          'babel-plugin-react-compiler': '1.0.0',
        },
      },
      ...FRONTEND_COMPILER_EXAMPLE,
      ...FRONTEND_ANALYTICS,
      {
        when: { analytics: 'posthog' },
        edits: [
          { file: 'README.md', before: '## Documentation', insert: ANALYTICS_POSTHOG_README },
        ],
      },
      ...FRONTEND_ANALYTICS_AND_AGENTS,
      ...APP_OPENED_IMPORTS,
      { when: { analytics: ['module', 'posthog'] }, edits: APP_OPENED },
      ...FRONTEND_SERVER_STATE_AGENTS,
      ...FRONTEND_AGENTS_AND_THEME,
      ...FRONTEND_NO_I18N,
      ...WEB_NO_I18N,
      {
        when: { i18n: 'none' },
        edits: [
          {
            file: 'docs/reference/layout.md',
            dropLines: 'The messages are data, so they live outside `src/`',
          },
          {
            file: 'docs/reference/verifications.md',
            replace:
              'base, the React, zustand and Vitest configs, and `@brutalway/oxlint-config-i18next`.',
            with: 'base and the React, zustand and Vitest configs.',
          },
        ],
      },
      ...FRONTEND_NO_UNIT_TESTS,
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
