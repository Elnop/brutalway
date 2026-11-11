import type { Stack } from '#src/shared-features/stack/StackTypes.ts';
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
} from '#src/features/stacks/configs/frontendChangesConfig.ts';

const SERVER_STATE_LINT_DOC = `
\`oxlint.config.ts\` also extends \`@brutalway/oxlint-config-tanstack-query\`: a query key comes from an \`xKeys\` factory, \`staleTime\` and \`gcTime\` from a profile of \`src/shared/QueryConfig.ts\`, a query key lists every variable its \`queryFn\` reads, and the \`QueryClient\` is created once, outside any component. \`fetch\` is only called from an \`xClient.ts\`, never inside an effect.
`;

const SERVER_STATE_ARCHITECTURE = `## Server state

From bedrock: data that comes from an API and state that only the UI owns are held by two different tools. Data from the API goes through TanStack Query, UI state goes into a zustand store, and a store never holds what the API returns.

The requests live in an \`xClient.ts\`, which parses each response with the Zod schemas of an \`xSchemas.ts\`, so a response that drifts from the API fails at the boundary instead of deep in a component. Query keys come from an \`xKeys.ts\` factory, so an invalidation reaches the query it targets. \`staleTime\` and \`gcTime\` come from the profiles of \`src/shared/QueryConfig.ts\`, the \`QueryClient\` lives in \`src/app/queryClient.ts\`, and an error thrown by a query or a mutation reaches React. Only orchestrators call the query hooks: a presenter still gets everything through props.

Enforced by \`@brutalway/oxlint-config-tanstack-query\` (keys, cache windows), \`@brutalway/oxlint-config-react\` (\`fetch\` only in an \`xClient.ts\`, never in an effect) and \`@brutalway/dependency-cruiser-config\` (no client, no query hook and no \`@tanstack/react-query\` in a presenter or a store).

`;

const SERVER_STATE_README = `## API

The todos come from an API. \`src/shared-features/todos/todosClient.ts\` calls \`/api/todos\` and \`/api/stats\` and parses each response with \`src/shared-features/todos/TodosSchemas.ts\`, the query hooks in \`src/shared-features/todos/hooks/\` cache the answers, and each change invalidates them through \`src/shared-features/todos/todosKeys.ts\`.

Without \`API_URL\`, \`devApi.ts\` answers these routes from an in-memory list, in \`npm run dev\` and in the \`vite preview\` the e2e tests run against, with one list per browser. To use [template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify) instead, start it and run \`API_URL=http://localhost:3000 npm run dev\`: \`/api\` is then proxied to it. In production, serve the API under \`/api\` next to the built files.

`;

const I18N_README = `The example comes in English and French. The buttons in the header switch between them through \`src/features/language-switch/LanguageSwitch.tsx\`, the languages are listed in \`src/features/language-switch/LanguagesConfig.ts\`, and \`src/features/language-switch/languageStorage.ts\` starts from the language saved in \`localStorage\`, or else the first one of the browser that the project has, and keeps \`<html lang>\` and the title of the page in line with it.

## Add a language

To add a language, add it to \`src/features/language-switch/LanguagesConfig.ts\`, add its folder next to \`src/app/locales/en/\`, import its files in \`src/app/createI18n.ts\` and list it under \`locales\` in \`i18next.config.ts\`.`;

const REACT_COMPILER_PLUGINS = `const reactCompiler =
  process.env['VITEST'] === undefined ? [babel({ presets: [reactCompilerPreset()] })] : [];

`;

const REACT_COMPILER_DOC = `\`vite.config.ts\` runs the [React Compiler](https://react.dev/learn/react-compiler) through Babel (\`babel-plugin-react-compiler\`, \`reactCompilerPreset()\` of \`@vitejs/plugin-react\`), so components and hooks are memoized at build time. Vitest runs without it, since its memo caches add branches the tests would have to reach: unit and component tests check the code as written, and the e2e tests run the compiled build. \`oxlint.config.ts\` reports \`useMemo\`, \`useCallback\` and \`memo\` imported from \`react\`.

`;

const ANALYTICS_POSTHOG_README = `## Analytics

\`src/shared/analyticsClient.ts\` is the only place where events leave the app: \`analyticsClient.track('todo_added', { source: 'form' })\` sends them to PostHog through \`posthog-js\`, and dependency-cruiser keeps \`posthog-js\` inside this file. Set \`VITE_POSTHOG_KEY\` in \`.env.local\`, which git ignores, and \`VITE_POSTHOG_HOST\` for another host than \`https://eu.i.posthog.com\`. Without a key nothing is sent, in dev, in preview or in the e2e tests. Autocapture and the scripts PostHog loads from its servers are off, and \`securityHeaders.ts\` lets the PostHog hosts through \`connect-src\`.

`;

const ANCHORS = {
  template: 'vite',
  preset: 'reactViteConfig',
  presetImport: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';",
  aliasFile: 'vite.config.ts',
  ignorePatterns: "'dist'",
  cspFile: 'securityHeaders.ts',
  lint: 'oxlint --type-aware src e2e oxlint.config.ts vite.config.ts vitest.config.ts vitest.setup.ts playwright.config.ts i18next.config.ts securityHeaders.ts',
  lintWithoutE2e:
    'oxlint --type-aware src oxlint.config.ts vite.config.ts vitest.config.ts vitest.setup.ts i18next.config.ts securityHeaders.ts',
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
      ...FRONTEND_SKELETON,
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
      {
        when: { 'server-state': true },
        overlay: 'server-state',
        edits: [
          {
            file: 'oxlint.config.ts',
            after: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';\n",
            insert:
              "import { tanstackQueryConfig } from '@brutalway/oxlint-config-tanstack-query';\n",
          },
          {
            file: 'oxlint.config.ts',
            replace: 'extends: [reactViteConfig',
            with: 'extends: [reactViteConfig, tanstackQueryConfig',
          },
          {
            file: 'docs/reference/verifications.md',
            after:
              '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)\n',
            insert: SERVER_STATE_LINT_DOC,
          },
          {
            file: 'docs/reference/verifications.md',
            replace: '- a presenter imports no store and no shared-feature hook\n',
            with: '- a presenter imports no store, no shared-feature hook, no `xClient.ts` and no `@tanstack/react-query`\n- a store imports no `xClient.ts`, no `xKeys.ts` and no hook: it only holds UI state\n',
          },
          {
            file: 'docs/concepts/architecture.md',
            before: '## Sub-features',
            insert: SERVER_STATE_ARCHITECTURE,
          },
        ],
        addDependencies: { '@tanstack/react-query': '5.107.1' },
        addDevDependencies: { '@brutalway/oxlint-config-tanstack-query': '0.2.0' },
      },
      {
        when: { 'server-state': true, example: false },
        remove: ['src/shared/.gitkeep'],
      },
      {
        when: { 'server-state': true, example: true },
        overlay: 'server-state-example',
        remove: [
          'src/shared-features/todos/useTodos.ts',
          'src/shared-features/todos/todosSelectors.ts',
          'src/shared-features/todos/todosSelectors.test.ts',
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
            replace: '`src/shared-features/todos/` holds the tasks and the current filter,',
            with: '`src/shared-features/todos/` holds the client of the todo API, its query hooks and the current filter,',
          },
          {
            file: 'docs/concepts/architecture.md',
            replace:
              ', `src/shared-features/todos/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared-features/todos/useTodos.ts`.',
            with: ', and components read the store through `src/shared-features/todos/hooks/useTodos.ts`. The store only holds the filter: the todos and the counters come from the API (see Server state below).',
          },
        ],
        addDependencies: { zod: '4.6.7' },
      },
      ...FRONTEND_FORMS,
      {
        when: { forms: true, 'server-state': true, styling: 'tailwind', ui: 'none' },
        edits: [
          {
            file: 'oxlint.config.ts',
            replace:
              'extends: [reactViteConfig, reactHookFormConfig, tanstackQueryConfig, tailwindConfig, i18nextConfig],',
            with: 'extends: [\n    reactViteConfig,\n    reactHookFormConfig,\n    tanstackQueryConfig,\n    tailwindConfig,\n    i18nextConfig,\n  ],',
          },
        ],
      },
      {
        when: { forms: true, 'server-state': true, styling: 'tailwind', ui: 'shadcn' },
        edits: [
          {
            file: 'oxlint.config.ts',
            replace:
              'extends: [reactViteConfig, reactHookFormConfig, tanstackQueryConfig, shadcnConfig, tailwindConfig, i18nextConfig],',
            with: 'extends: [\n    reactViteConfig,\n    reactHookFormConfig,\n    tanstackQueryConfig,\n    shadcnConfig,\n    tailwindConfig,\n    i18nextConfig,\n  ],',
          },
        ],
      },
      ...FRONTEND_FORMS_EXAMPLE,
      {
        when: { forms: true, example: true, 'server-state': false },
        overlay: 'forms-schemas',
      },
      {
        when: { forms: true, example: true, 'server-state': true },
        edits: [
          {
            file: 'src/shared-features/todos/TodosSchemas.ts',
            after: "import { z } from 'zod';\n",
            insert:
              "import { normalizeTitle } from '@/shared/normalizeTitle.ts';\nimport { TITLE_ERRORS } from '@/shared-features/todos/TodosConfig.ts';\n",
          },
          {
            file: 'src/shared-features/todos/TodosSchemas.ts',
            after: 'export const ClearedSchema = z.object({ deleted: z.number().int().min(0) });\n',
            insert:
              '\nexport const TodoDraftSchema = z.object({\n  title: z\n    .string()\n    .transform(normalizeTitle)\n    .pipe(z.string().min(1, TITLE_ERRORS[0]).max(200, TITLE_ERRORS[1])),\n});\n',
          },
          {
            file: 'src/shared-features/todos/TodosTypes.ts',
            replace: 'import type { TodoFilterSchema, TodoSchema } from',
            with: 'import type {\n  TodoDraftSchema,\n  TodoFilterSchema,\n  TodoSchema,\n} from',
          },
          {
            file: 'src/shared-features/todos/TodosTypes.ts',
            after: 'export type TodoFilter = z.infer<typeof TodoFilterSchema>;\n',
            insert: '\nexport type TodoDraft = z.output<typeof TodoDraftSchema>;\n',
          },
          {
            file: 'src/shared-features/todos/todosClient.ts',
            replace: 'import type { Todo, TodoFilter, TodoUpdate }',
            with: 'import type {\n  Todo,\n  TodoDraft,\n  TodoFilter,\n  TodoUpdate,\n}',
          },
          {
            file: 'src/shared-features/todos/todosClient.ts',
            replace:
              "create: async (title: string) => request(TodoSchema, 'POST', '/todos', { title }),",
            with: "create: async (draft: TodoDraft) => request(TodoSchema, 'POST', '/todos', draft),",
          },
          {
            file: 'src/features/todo-list/useTodoList.ts',
            replace:
              'return { todos, filter, add, setFilter: todosActions.setFilter, toggle, rename, remove };',
            with: 'return {\n    todos,\n    filter,\n    add: (title: string) => add({ title }),\n    setFilter: todosActions.setFilter,\n    toggle,\n    rename,\n    remove,\n  };',
          },
        ],
      },
      {
        when: { i18n: true },
        overlay: 'i18n',
        edits: [
          {
            file: 'src/app/locales/en/app.json',
            after: '{\n',
            insert:
              '  "language": "Language",\n  "languages": { "en": "English", "fr": "Français" },\n',
          },
          {
            file: 'src/app/createI18n.ts',
            replace: '      en: {',
            with: '      fr: FRENCH,\n      en: {',
          },
          {
            file: 'i18next.config.ts',
            replace: "locales: ['en'],",
            with: "locales: ['en', 'fr'],",
          },
          {
            file: 'src/main.tsx',
            after: "import { createI18n } from '@/app/createI18n.ts';\n",
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
              "import { LanguageSwitch } from '@/features/language-switch/LanguageSwitch.tsx';\n",
          },
          {
            file: 'src/app/App.tsx',
            before: '      </header>',
            insert: '        <LanguageSwitch />\n',
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
      {
        when: { 'server-state': true },
        edits: [
          {
            file: 'AGENTS.md',
            before: '- No comments,',
            insert:
              '- Data from the API goes through the query hooks of TanStack Query, each request lives in an `xClient.ts` that parses the response with Zod, and a store only holds UI state.\n',
          },
        ],
      },
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
