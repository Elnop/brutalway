import type { FileEdit, StackChange, StackOption } from '#src/shared-features/stack/StackTypes.ts';
import { SHADCN_DEPENDENCIES, SHADCN_VERSION } from '#src/features/stacks/configs/shadcnConfig.ts';
import { TEMPLATE_ONLY_DOCS } from '#src/features/stacks/configs/templateDocsConfig.ts';

const CHROMIUM_LINE = '      - run: npx playwright install --with-deps --only-shell chromium\n';

const E2E_JOB = `
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm
      - run: npm ci
${CHROMIUM_LINE}      - run: npm run e2e
`;

const UNIT_PROJECT = `        {
          extends: true,
          test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] },
        },
`;

const COMPONENT_PROJECT = `        {
          extends: true,
          test: {
            name: 'component',
            include: ['src/**/*.test.tsx'],
            browser: {
              enabled: true,
              provider: playwright(),
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
          },
        },
`;

export const PRESENTER_TEST_EXAMPLE = {
  file: 'docs/concepts/architecture.md',
  replace: ', as `src/features/todo-list/components/presenters/TodoInput.test.tsx` does,',
  with: ',',
};

const TAILWIND_DOC = `\`oxlint.config.ts\` also extends \`@brutalway/oxlint-config-tailwind\`. A color is a token declared under \`@theme\` in \`src/app/globals.css\`: no \`bg-white\`, no \`bg-[#0f0f0f]\`, no hex in \`style\`, and the message names the closest tokens. \`h1\` to \`h3\` take \`font-display\`, \`code\` and \`pre\` take \`font-mono\`, and \`dark:\` is reported, since a theme changes the values of the tokens, never a class. Prettier sorts the classes with \`prettier-plugin-tailwindcss\`, through \`@brutalway/prettier-config/tailwind\`.

`;

const CSS_MODULES_DOC = `A component with styles has its own \`X.module.css\` next to it and reads it with \`import styles from '@/features/x/X.module.css'\`. On these files the config also reports a stylesheet without its \`X.tsx\` beside it, a class the component never uses, and a class not written in camelCase. \`npm run typecheck\` first runs \`happy-css-modules\`, which writes one \`.d.ts\` per stylesheet into \`node_modules/.cache/css-modules\`, so \`styles.typo\` is a tsc error. After adding a class, run \`npm run css-types\` (or \`npm run css-types -- --watch\`) so the editor sees it.

`;

const CSS_MODULES_TYPES =
  "hcm 'src/**/*.module.css' --outDir node_modules/.cache/css-modules --no-declarationMap --no-cache --logLevel silent";

const STYLELINT_SETTINGS = '  "stylelint": {\n    "extends": "@brutalway/stylelint-config"\n  },\n';

const FORMS_LINT_DOC = `
\`oxlint.config.ts\` also extends \`@brutalway/oxlint-config-react-hook-form\`: \`useForm\` takes \`resolver: zodResolver(XSchema)\`, and no validation goes to \`register\`, \`useController\` or a \`Controller\`. What a field accepts, and the message shown when it does not, is written once, in the schema.
`;

const SHADCN_THEME = `  --shadow-hard-sm: 4px 4px 0 var(--color-ink);
  --shadow-xs: var(--shadow-hard-sm);
  --shadow-sm: var(--shadow-hard);

  --font-weight-*: initial;
  --font-weight-normal: 400;
  --font-weight-bold: 700;

  --radius-*: initial;
  --default-border-width: 3px;
}

@theme inline {
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --color-primary: var(--color-yellow);
  --color-primary-foreground: var(--color-on-accent);
  --color-secondary: var(--color-paper);
  --color-secondary-foreground: var(--color-ink);
  --color-destructive: var(--color-pink);
  --color-accent: var(--color-yellow);
  --color-accent-foreground: var(--color-on-accent);
  --color-card: var(--color-paper);
  --color-card-foreground: var(--color-ink);
  --color-muted-foreground: var(--color-ink);
  --color-border: var(--color-ink);
  --color-input: var(--color-ink);
  --color-ring: var(--color-focus);
}`;

const SHADCN_SLOTS = `  [data-slot='button'] {
    border: var(--default-border-width) solid var(--color-ink);
    font-weight: 700;
    box-shadow: var(--shadow-hard-sm);
    cursor: pointer;

    &:active:not(:disabled) {
      transform: translate(4px, 4px);
      box-shadow: none;
    }

    &[data-variant='destructive'] {
      color: var(--color-on-accent);
    }
  }

`;

const SHADCN_README = `## UI primitives

The buttons, fields, checkboxes and cards come from [shadcn/ui](https://ui.shadcn.com). The shadcn CLI copied their files into \`third-party/shadcn/\`, and they stay as the registry wrote them, so \`npx shadcn add <name> --overwrite\` can replace them at any time. The code in \`src/\` imports them through \`@third-party/shadcn/\`.

To add one, run \`npx shadcn add <name>\` (\`dialog\`, \`select\`, \`tabs\`...), then check \`package.json\`: the CLI sometimes misses a package the file imports, and sometimes installs one no file imports (\`date-fns\` with \`calendar\`). knip reports both. A primitive with an animation (\`dialog\`, \`dropdown-menu\`, \`sheet\`...) also needs \`npm install -E tw-animate-css\` and \`@import 'tw-animate-css';\` in \`src/app/globals.css\`, which the CLI does not write since the project owns that file.

To change how a primitive looks, leave its file alone. shadcn's colors are mapped onto the project's under \`@theme inline\` in \`src/app/globals.css\`, where the tokens also make every border thick, every corner square and every shadow hard. Beyond that, add a rule on the primitive's \`data-slot\` in the same file, pass a class from the component that uses it, or write a component in \`src/shared/\` that wraps it. The \`dark:\` classes of the primitives only apply under a \`.dark\` class (\`@custom-variant dark\` in \`src/app/globals.css\`), which the app never sets, so the primitives do not change when the system turns dark: the theme comes from the tokens.

`;

const SHADCN_TYPESCRIPT_DOC = `\`tsconfig.third-party.json\` is a third project, for \`third-party/\`. It extends \`@brutalway/tsconfig/react-vite-third-party.json\`, which turns off \`exactOptionalPropertyTypes\` and \`noPropertyAccessFromIndexSignature\`: shadcn's code is not written for them. The two other projects reference it, and \`npm run typecheck\` runs \`tsc -b\`, so \`src/\` reads the vendored files through the declarations written into \`node_modules/.cache/tsc-third-party\` and keeps every flag.

`;

const VENDORED_PRE_TOOL_USE = `    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx --no-install brutal-agent-hook --vendored third-party",
            "timeout": 10,
            "statusMessage": "refuses edits to vendored code"
          }
        ]
      }
    ],
`;

const SHADCN_LINT_DOC = `
\`oxlint.config.ts\` also extends \`@brutalway/oxlint-config-shadcn\`: no raw \`<button>\`, \`<input>\`, \`<select>\` or \`<textarea>\` in \`src/\`, the message names the primitive to import from \`@third-party/shadcn/\` and the \`npx shadcn add\` command when it is not vendored yet. Icons only come from \`lucide-react\`, the library of \`components.json\`.
`;

const SHADCN_VERIFICATIONS_DOC = `## Vendored code

\`third-party/shadcn/\` holds the files the shadcn CLI copied. Oxlint and check-tree only look at \`src/\`, dependency-cruiser runs on both folders, Prettier skips \`third-party/\` and \`components.json\` (\`.prettierignore\`) so \`--overwrite\` gives no formatting diff, and knip takes every file there as an entry, so a primitive not used yet is not reported. alint checks that \`third-party/\` only holds the folders listed in \`.alint.yml\`, one per registry: hand-written code goes in \`src/\`.

`;

const SHADCN_DRIFT_STEP = `      - name: Vendored shadcn files match the registry
        run: |
          npx shadcn add $(basename -s .tsx third-party/shadcn/*.tsx) --overwrite --yes
          git diff --exit-code -- third-party/shadcn || { echo "::error::A file of third-party/shadcn/ differs from what the shadcn CLI writes: undo the hand edit with npx shadcn add <name> --overwrite, and restyle through src/app/globals.css or a wrapper in src/."; exit 1; }
`;

const SHADCN_DRIFT_DOC = ` CI runs \`npx shadcn add <name> --overwrite\` on each file of \`third-party/shadcn/\`, with the \`shadcn\` version pinned in \`package.json\`, and fails when the result differs from the commit: a hand edit there is caught even when it did not go through the agent hook.
`;

const THIRD_PARTY_ALINT = `  - id: third-party-only-registries
    kind: dir_absent
    paths: ['third-party/*', '!third-party/shadcn']
    message: 'third-party/ only holds code copied from a registry, one folder per registry listed in .alint.yml. Write your own code in src/.'
    level: error
  - id: third-party-no-loose-files
    kind: file_absent
    paths: ['third-party/*']
    message: 'third-party/ only holds code copied from a registry, one folder per registry listed in .alint.yml. Write your own code in src/.'
    level: error
`;

const THIRD_PARTY_REFERENCES = '  "references": [{ "path": "./tsconfig.third-party.json" }],\n';

const COVERAGE_CONFIG = `      coverage: {
        provider: 'v8',
        reporter: ['text'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
{{coverageEntries}}          'src/app/**',
          '**/*.test.{ts,tsx}',
          '**/*{Container,Layout,Page}.tsx',
          '**/use[A-Z]*.ts',
          '**/*{Client,Keys,Types,Config,Schemas,Storage}.ts',
        ],
        thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
      },
`;

const COVERAGE_DOC = `\`npm test\` also measures coverage with \`@vitest/coverage-v8\` and fails under 90 % of the lines, functions, branches or statements of what Vitest is meant to test: presenters, pure functions, selectors and stores. Orchestrators, hooks, clients, \`xStorage.ts\` files{{coverageLeftOut}} are left out (\`vitest.config.ts\`), since the e2e tests cover them. \`npm run test:unit\` and \`npm run test:component\` run without it.

`;

const REACT_COMPILER_LINT = `      {
        paths: [
          {
            name: 'react',
            importNames: ['useMemo', 'useCallback', 'memo'],
            message:
              'The React Compiler memoizes components and hooks: drop useMemo, useCallback and memo, and write the plain value or function.',
          },
        ],
        patterns: [
`;

const ANALYTICS_MODULE_README = `## Analytics

\`src/shared/analyticsClient.ts\` is the only place where events leave the app: \`analyticsClient.track('todo_added', { source: 'form' })\`. It sends nothing yet: it dispatches an \`analytics\` event on \`window\` with the name and the properties, for the tool you plug in there. Replace its body with your SDK, and dependency-cruiser keeps that SDK inside this file.

`;

const ANALYTICS_LAYOUT_FUNCTION = `
  function addTodo(title: string) {
    list.add(title);
    analyticsClient.track('todo_added');
  }
`;

const DARK_TOKENS = `  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #f4ede0;
    --paper: #1f1d1a;
    --page: #12110f;
    --yellow: #f2df8a;
    --pink: #f0a6d6;
    --blue: #9fb4f5;
    --focus: #b3c5ff;
  }
}
`;

const DARK_TAILWIND_TOKENS = `  html {
    color-scheme: light dark;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-ink: #f4ede0;
      --color-paper: #1f1d1a;
      --color-page: #12110f;
      --color-yellow: #f2df8a;
      --color-pink: #f0a6d6;
      --color-blue: #9fb4f5;
      --color-focus: #b3c5ff;
    }
  }`;

const DARK_THEME_README = `The colors follow the theme of the system. The \`@media (prefers-color-scheme: dark)\` block of \`src/app/globals.css\` gives each color token its dark value, so a component never picks a color per theme. The pastel accents carry dark text in both themes (\`on-accent\`) and the other surfaces the ink of the theme, so text keeps a contrast of at least 4.5:1 everywhere.

`;

const CHROMIUM_DOC =
  'Component tests and e2e need headless Chromium: `npx playwright install --only-shell chromium`.';

const SERVER_STATE_LINT_DOC = `
\`oxlint.config.ts\` also extends \`@brutalway/oxlint-config-tanstack-query\`: a query key comes from an \`xKeys\` factory, \`staleTime\` and \`gcTime\` from a profile of \`src/shared/QueryConfig.ts\`, a query key lists every variable its \`queryFn\` reads, and the \`QueryClient\` is created once, outside any component. \`fetch\` is only called from an \`xClient.ts\`, never inside an effect.
`;

const SERVER_STATE_ARCHITECTURE = `## Server state

From bedrock: data that comes from an API and state that only the UI owns are held by two different tools. Data from the API goes through TanStack Query, UI state goes into a zustand store, and a store never holds what the API returns.

The requests live in an \`xClient.ts\`, which parses each response with the Zod schemas of an \`xSchemas.ts\`, so a response that drifts from the API fails at the boundary instead of deep in a component. Query keys come from an \`xKeys.ts\` factory, so an invalidation reaches the query it targets. \`staleTime\` and \`gcTime\` come from the profiles of \`src/shared/QueryConfig.ts\`, the \`QueryClient\` lives in \`src/features/query-client/queryClient.ts\`, and an error thrown by a query or a mutation reaches React. Only orchestrators call the query hooks: a presenter still gets everything through props.

Enforced by \`@brutalway/oxlint-config-tanstack-query\` (keys, cache windows), \`@brutalway/oxlint-config-react\` (\`fetch\` only in an \`xClient.ts\`, never in an effect) and \`@brutalway/dependency-cruiser-config\` (no client, no query hook and no \`@tanstack/react-query\` in a presenter or a store).

`;

export const I18N_LOCALE_EDITS: FileEdit[] = [
  {
    file: 'src/app/locales/en/app.json',
    after: '{\n',
    insert: '  "language": "Language",\n  "languages": { "en": "English", "fr": "Français" },\n',
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
];

export const FRONTEND_LOOK_OPTIONS: StackOption[] = [
  {
    id: 'example',
    message: 'Keep the todo list example?',
    default: true,
    requires: { zustand: true },
  },
  { id: 'zustand', message: 'Add zustand for state?', default: true },
  {
    id: 'styling',
    message: 'How do you want to write styles?',
    default: 'css',
    values: [
      { id: 'css', label: 'Plain CSS files' },
      { id: 'css-modules', label: 'CSS Modules, a stylesheet next to each component' },
      { id: 'tailwind', label: 'Tailwind CSS, colors and fonts as tokens under @theme' },
    ],
  },
  {
    id: 'ui',
    message: 'Which UI primitives?',
    default: 'none',
    values: [
      { id: 'none', label: 'None, the components style plain elements' },
      {
        id: 'shadcn',
        label: 'shadcn/ui, vendored in third-party/shadcn/ (needs Tailwind)',
        requires: { styling: 'tailwind' },
      },
    ],
  },
  { id: 'dark-theme', message: 'Follow the dark mode of the system?', default: false },
];

export const FRONTEND_FEATURE_OPTIONS: StackOption[] = [
  { id: 'forms', message: 'Validate the forms with react-hook-form and Zod?', default: false },
  { id: 'i18n', message: 'Add French and a language switch?', default: false },
  {
    id: 'react-compiler',
    message: 'Memoize with the React Compiler instead of useMemo and useCallback?',
    default: false,
  },
  {
    id: 'analytics',
    message: 'How should the app send product events?',
    default: 'none',
    values: [
      { id: 'none', label: 'It does not' },
      { id: 'module', label: 'Through one module of its own, to plug any tool into' },
      { id: 'posthog', label: 'Through that module, sending to PostHog' },
    ],
  },
  { id: 'component-tests', message: 'Add component tests (Vitest in Chromium)?', default: true },
  {
    id: 'coverage',
    message:
      'Fail the tests under 90 % coverage of presenters, pure functions, selectors and stores?',
    default: false,
    requires: { 'component-tests': true },
  },
  { id: 'e2e', message: 'Add e2e tests (Playwright)?', default: true },
  {
    id: 'claude-hook',
    message: 'Add the Claude Code hook that lints each edited file?',
    default: true,
    independent: true,
  },
  { id: 'ci', message: 'Add the GitHub Actions workflow?', default: true },
];

export const FRONTEND_BASE: StackChange[] = [
  {
    when: {},
    remove: ['CHANGELOG.md'],
    edits: [
      { file: 'README.md', replace: '# template-{{template}}\n', with: '# __PROJECT_NAME__\n' },
    ],
  },
  TEMPLATE_ONLY_DOCS,
];

export const FRONTEND_SKELETON: StackChange[] = [
  {
    when: { example: false },
    remove: [
      'src/features/todo-list',
      'src/features/todo-stats',
      'src/shared-features/todos',
      'src/shared/normalizeTitle.ts',
      'src/shared/normalizeTitle.test.ts',
      'src/app/locales/en/todoList.json',
      'src/app/locales/en/todoStats.json',
    ],
    edits: [
      {
        file: 'README.md',
        replace:
          'The example app is a todo list. It is there so every rule has real code to check: delete it and keep the structure. The look',
        with: 'The look',
      },
      {
        file: 'docs/reference/layout.md',
        replace:
          'In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.\n\n',
        with: '',
      },
      {
        file: 'docs/guides/start-your-own-app.md',
        dropLines: '1. Delete `src/features/todo-list/`',
      },
      {
        file: 'docs/guides/translations.md',
        replace: 'each slice has its own namespace (`app`, `todoList`, `todoStats`)',
        with: 'each slice gets its own namespace, `app` for now',
      },
      {
        file: 'docs/guides/start-your-own-app.md',
        replace: '2. Write your first feature',
        with: '1. Write your first feature',
      },
      {
        file: 'docs/guides/start-your-own-app.md',
        replace: '3. Run `npm run check` often',
        with: '2. Run `npm run check` often',
      },
      {
        file: 'docs/reference/verifications.md',
        replace: '`src/shared/normalizeTitle.test.ts` next to its source',
        with: 'next to its source',
      },
      {
        file: 'docs/reference/verifications.md',
        replace: '`src/features/todo-list/components/presenters/TodoInput.test.tsx`',
        with: 'next to the presenter',
      },
      {
        file: 'docs/concepts/architecture.md',
        replace:
          ' `src/features/todo-list/components/TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts` and hands them to the presenters in `src/features/todo-list/components/presenters/`.',
        with: '',
      },
      {
        file: 'docs/concepts/architecture.md',
        dropLines: 'Renaming a task is a sub-feature of the list',
      },
      {
        file: 'docs/concepts/architecture.md',
        replace:
          '`src/shared-features/todos/todosStore.ts` only exports `todosStore` and `todosActions`, `src/shared-features/todos/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared-features/todos/useTodos.ts`.',
        with: 'An `xStore.ts` only exports `xStore` and `xActions`, an `xSelectors.ts` only exports `selectX` functions, and components read the store through a `useX.ts` hook.',
      },
    ],
    overlay: 'skeleton',
    keep: ['src/features', 'src/shared-features', 'src/shared'],
  },
];

export const FRONTEND_TAILWIND: StackChange[] = [
  {
    when: { styling: 'tailwind' },
    overlay: 'tailwind',
    edits: [
      {
        file: 'knip.json',
        replace: '"src/**/*.{ts,tsx}!"',
        with: '"src/**/*.{ts,tsx,css}!"',
      },
      {
        file: 'oxlint.config.ts',
        after: '{{presetImport}}\n',
        insert: "import { tailwindConfig } from '@brutalway/oxlint-config-tailwind';\n",
      },
      {
        file: 'oxlint.config.ts',
        replace: 'extends: [{{preset}}',
        with: 'extends: [{{preset}}, tailwindConfig',
      },
      {
        file: 'package.json',
        replace: '"prettier": "@brutalway/prettier-config"',
        with: '"prettier": "@brutalway/prettier-config/tailwind"',
      },
      {
        file: 'README.md',
        replace: 'easy to swap: the tokens are at the top of `src/app/globals.css`.',
        with: 'easy to swap: the colors, fonts and shadows are tokens declared under `@theme` in `src/app/globals.css`, and the components style themselves with Tailwind classes built on them.',
      },
      {
        file: 'docs/reference/verifications.md',
        before: '## Dependencies',
        insert: TAILWIND_DOC,
      },
      { file: 'docs/reference/verifications.md', dropSection: '## Styles' },
      { file: 'package.json', replace: STYLELINT_SETTINGS, with: '' },
      {
        file: 'package.json',
        replace: 'npm run lint && npm run styles && ',
        with: 'npm run lint && ',
      },
      {
        file: 'docs/reference/commands.md',
        replace: 'Oxlint, stylelint, dependency-cruiser',
        with: 'Oxlint, dependency-cruiser',
      },
    ],
    removeScripts: ['styles'],
    removeDependencies: ['stylelint', '@brutalway/stylelint-config'],
    addDevDependencies: {
      '@brutalway/oxlint-config-tailwind': '0.1.3',
      '@brutalway/prettier-config': '0.3.0',
      'prettier-plugin-tailwindcss': '0.8.1',
      tailwindcss: '4.3.5',
    },
  },
];

export const FRONTEND_UI_AND_STYLING: StackChange[] = [
  {
    when: { styling: 'tailwind', example: true },
    remove: ['src/features/todo-list/todo-list.css', 'src/features/todo-stats/todo-stats.css'],
    overlay: 'tailwind-example',
  },
  {
    when: { styling: 'tailwind', example: false },
    overlay: 'tailwind-skeleton',
  },
  {
    when: { ui: 'shadcn' },
    overlay: 'shadcn',
    edits: [
      {
        file: 'src/app/globals.css',
        replace: '  --shadow-hard-sm: 4px 4px 0 var(--color-ink);\n}',
        with: SHADCN_THEME,
      },
      { file: 'src/app/globals.css', before: '  :focus-visible {', insert: SHADCN_SLOTS },
      {
        file: 'src/app/globals.css',
        replace: "@import 'tailwindcss';\n",
        with: "@import 'tailwindcss';\n\n@custom-variant dark (&:where(.dark, .dark *));\n",
      },
      {
        file: '{{aliasFile}}',
        replace:
          "alias: [{ find: /^@\\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) }],",
        with: "alias: [\n      { find: /^@\\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },\n      {\n        find: /^@third-party\\//u,\n        replacement: fileURLToPath(new URL('./third-party/', import.meta.url)),\n      },\n    ],",
      },
      {
        file: 'tsconfig.json',
        replace:
          '{\n  "files": [],\n  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.test.json" }]',
        with: '{\n  "compilerOptions": {\n    "paths": { "@third-party/*": ["./third-party/*"] }\n  },\n  "files": [],\n  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.test.json" }, { "path": "./tsconfig.third-party.json" }]',
      },
      { file: 'tsconfig.app.json', before: '  "include": [', insert: THIRD_PARTY_REFERENCES },
      { file: 'tsconfig.test.json', before: '  "include": [', insert: THIRD_PARTY_REFERENCES },
      {
        file: 'package.json',
        replace: 'tsc -p tsconfig.app.json && tsc -p tsconfig.test.json"',
        with: 'tsc -b tsconfig.app.json tsconfig.test.json"',
      },
      { file: '.prettierignore', before: 'dist\n', insert: 'components.json\n' },
      { file: '.prettierignore', after: 'test-results\n', insert: 'third-party\n' },
      {
        file: 'knip.json',
        replace: '"entry": ["i18next.config.ts"]',
        with: '"entry": ["i18next.config.ts", "third-party/**/*.{ts,tsx}!"]',
      },
      {
        file: 'knip.json',
        replace: '"ignoreDependencies": [\n    "@swc/core",\n',
        with: '"ignoreDependencies": [\n    "@swc/core",\n    "shadcn",\n',
      },
      {
        file: 'oxlint.config.ts',
        replace: 'ignorePatterns: [{{ignorePatterns}}]',
        with: "ignorePatterns: [{{ignorePatterns}}, 'third-party']",
      },
      {
        file: '.alint.yml',
        replace: "prefixes: ['src/',",
        with: "prefixes: ['src/', 'third-party/',",
      },
      { file: '.alint.yml', after: '    level: error\n', insert: THIRD_PARTY_ALINT },
      { file: 'README.md', before: '## Documentation', insert: SHADCN_README },
      {
        file: 'docs/reference/commands.md',
        replace: '| `npm run check` | Prettier, both `tsc` projects,',
        with: '| `npm run check` | Prettier, the three `tsc` projects,',
      },
      {
        file: 'docs/reference/verifications.md',
        before: '## Lint',
        insert: SHADCN_TYPESCRIPT_DOC,
      },
      {
        file: 'docs/reference/verifications.md',
        before: '## Tests',
        insert: SHADCN_VERIFICATIONS_DOC,
      },
      {
        file: '.dependency-cruiser.cjs',
        replace: "extends: '@brutalway/dependency-cruiser-config/layers'",
        with: "extends: '@brutalway/dependency-cruiser-config/shadcn'",
      },
      {
        file: 'package.json',
        replace: '"deps": "depcruise --output-type err-long src"',
        with: '"deps": "depcruise --output-type err-long src third-party"',
      },
      {
        file: 'oxlint.config.ts',
        after: '{{presetImport}}\n',
        insert: "import { shadcnConfig } from '@brutalway/oxlint-config-shadcn';\n",
      },
      {
        file: 'oxlint.config.ts',
        replace: 'extends: [{{preset}}',
        with: 'extends: [{{preset}}, shadcnConfig',
      },
      {
        file: 'docs/reference/verifications.md',
        after:
          '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)\n',
        insert: SHADCN_LINT_DOC,
      },
      {
        file: 'docs/reference/verifications.md',
        after: '- a store lives at the root or in the `stores/` folder of its level\n',
        insert:
          '- `third-party/` imports nothing from `src/`, and `radix-ui` and `class-variance-authority` are only imported from `third-party/`: `src/` uses the primitives\n',
      },
    ],
    addDependencies: SHADCN_DEPENDENCIES,
    addDevDependencies: {
      '@brutalway/oxlint-config-shadcn': '0.2.0',
      '@brutalway/tsconfig': '0.4.0',
      shadcn: SHADCN_VERSION,
    },
  },
  {
    when: { ui: 'shadcn', example: true },
    overlay: 'shadcn-example',
  },
  {
    when: { ui: 'shadcn', ci: true },
    edits: [
      {
        file: '.github/workflows/ci.yml',
        before: '      - run: npm run build',
        insert: SHADCN_DRIFT_STEP,
      },
      {
        file: 'docs/reference/verifications.md',
        replace: 'hand-written code goes in `src/`.\n',
        with: `hand-written code goes in \`src/\`.${SHADCN_DRIFT_DOC}`,
      },
      {
        file: 'docs/reference/commands.md',
        replace: 'runs `check`, `test` and `build` in one job',
        with: 'runs `check`, `test`, a comparison of `third-party/shadcn/` with the registry and `build` in one job',
      },
    ],
  },
  {
    when: { ui: 'shadcn', 'claude-hook': true },
    edits: [
      {
        file: '.claude/settings.json',
        replace: '"hooks": {\n    "PostToolUse": [',
        with: `"hooks": {\n${VENDORED_PRE_TOOL_USE}    "PostToolUse": [`,
      },
      {
        file: '.claude/settings.json',
        replace: 'brutal-agent-hook --tree src"',
        with: 'brutal-agent-hook --tree src --vendored third-party"',
      },
      {
        file: 'docs/guides/work-with-an-agent.md',
        replace:
          'Every message says what to change, so the agent does not need to know the convention beforehand.',
        with: 'Every message says what to change, so the agent does not need to know the convention beforehand. Before an edit, the same hook refuses any change to a file in `third-party/` and tells the agent to run `npx shadcn add <name> --overwrite`, restyle through `src/app/globals.css` or wrap the primitive in `src/`.',
      },
    ],
    addDevDependencies: { '@brutalway/agent-hook': '0.2.1' },
  },
  {
    when: { styling: 'css-modules' },
    overlay: 'css-modules',
    edits: [
      {
        file: 'package.json',
        replace: '"typecheck": "i18next-cli types --quiet && tsc -p',
        with: '"typecheck": "i18next-cli types --quiet && npm run css-types && tsc -p',
      },
      {
        file: 'package.json',
        after:
          '"typecheck": "i18next-cli types --quiet && npm run css-types && tsc -p tsconfig.app.json && tsc -p tsconfig.test.json",\n',
        insert: `    "css-types": "${CSS_MODULES_TYPES}",\n`,
      },
      {
        file: 'package.json',
        replace: '"prepare": "git config core.hooksPath .githooks && i18next-cli types --quiet"',
        with: '"prepare": "git config core.hooksPath .githooks && i18next-cli types --quiet && npm run css-types"',
      },
      {
        file: 'README.md',
        replace: 'easy to swap: the tokens are at the top of `src/app/globals.css`.',
        with: 'easy to swap: the tokens are at the top of `src/app/globals.css`, and each component styles itself in the `X.module.css` next to it.',
      },
      {
        file: 'docs/reference/verifications.md',
        before: '## Dependencies',
        insert: CSS_MODULES_DOC,
      },
      {
        file: 'docs/reference/verifications.md',
        replace: 'It also rejects two CSS files outside a `styles/` folder.',
        with: 'It also rejects two CSS files outside a `styles/` folder. A `X.module.css` does not count: it stays next to its `X.tsx`.',
      },
    ],
    addDevDependencies: { 'happy-css-modules': '5.0.2' },
  },
  {
    when: { styling: 'css-modules', example: true },
    remove: ['src/features/todo-list/todo-list.css', 'src/features/todo-stats/todo-stats.css'],
    overlay: 'css-modules-example',
  },
  {
    when: { styling: 'css-modules', example: false },
    overlay: 'css-modules-skeleton',
  },
];

export const FRONTEND_FORMS: StackChange[] = [
  {
    when: { forms: true },
    edits: [
      {
        file: 'oxlint.config.ts',
        after: '{{presetImport}}\n',
        insert: "import { reactHookFormConfig } from '@brutalway/oxlint-config-react-hook-form';\n",
      },
      {
        file: 'oxlint.config.ts',
        replace: 'extends: [{{preset}}',
        with: 'extends: [{{preset}}, reactHookFormConfig',
      },
      {
        file: 'docs/reference/verifications.md',
        after: '{{testsLintLine}}\n',
        insert: FORMS_LINT_DOC,
      },
    ],
    addDependencies: {
      '@hookform/resolvers': '7.0.3',
      'react-hook-form': '7.91.0',
      zod: '4.6.7',
    },
    addDevDependencies: { '@brutalway/oxlint-config-react-hook-form': '0.2.0' },
  },
];

export const FRONTEND_FORMS_EXAMPLE: StackChange[] = [
  {
    when: { forms: true, example: false },
    edits: [
      {
        file: 'knip.json',
        replace: '"ignoreDependencies": [\n    "@swc/core",\n',
        with: '"ignoreDependencies": [\n    "@swc/core",\n    "@hookform/resolvers",\n    "react-hook-form",\n    "zod",\n',
      },
    ],
  },
  {
    when: { forms: true, example: true },
    overlay: 'forms-example',
    edits: [
      {
        file: 'src/shared-features/todos/TodosConfig.ts',
        after: "export const TODO_FILTERS = ['all', 'active', 'completed'] as const;\n",
        insert: "\nexport const TITLE_ERRORS = ['blankTitle', 'longTitle'] as const;\n",
      },
      {
        file: 'src/app/locales/en/todoList.json',
        replace: '"blankTitle": "The title is blank"',
        with: '"blankTitle": "The title is blank",\n    "longTitle": "The title is 200 characters at most"',
      },
    ],
  },
];

export const FRONTEND_I18N_LOCALES: StackChange[] = [
  {
    when: { i18n: true, example: true },
    overlay: 'i18n-example',
    edits: [
      {
        file: 'src/app/createI18n.ts',
        after: "import todoStats from '@/app/locales/en/todoStats.json';\n",
        insert:
          "import frApp from '@/app/locales/fr/app.json';\nimport frTodoList from '@/app/locales/fr/todoList.json';\nimport frTodoStats from '@/app/locales/fr/todoStats.json';\n",
      },
      {
        file: 'src/app/createI18n.ts',
        replace: 'fr: FRENCH,',
        with: 'fr: { app: frApp, todoList: frTodoList, todoStats: frTodoStats },',
      },
    ],
  },
  {
    when: { i18n: true, example: false },
    overlay: 'i18n-skeleton',
    edits: [
      {
        file: 'src/app/createI18n.ts',
        after: "import app from '@/app/locales/en/app.json';\n",
        insert: "import frApp from '@/app/locales/fr/app.json';\n",
      },
      { file: 'src/app/createI18n.ts', replace: 'fr: FRENCH,', with: 'fr: { app: frApp },' },
    ],
  },
];

const FRONTEND_I18N_STYLING: StackChange[] = [
  {
    when: { i18n: true, styling: 'css-modules' },
    remove: ['src/features/language-switch/language-switch.css'],
    overlay: 'i18n-css-modules',
  },
  {
    when: { i18n: true, styling: 'tailwind' },
    remove: ['src/features/language-switch/language-switch.css'],
    overlay: 'i18n-tailwind',
  },
  {
    when: { i18n: true, ui: 'shadcn' },
    overlay: 'i18n-shadcn',
  },
];

export const FRONTEND_I18N_FORMS: StackChange[] = [
  {
    when: { i18n: true, example: true, forms: true },
    edits: [
      {
        file: 'src/app/locales/fr/todoList.json',
        replace: '"blankTitle": "Le titre est vide"',
        with: '"blankTitle": "Le titre est vide",\n    "longTitle": "Le titre fait au plus 200 caractères"',
      },
    ],
  },
];

const FRONTEND_I18N_E2E_AND_COVERAGE: StackChange[] = [
  {
    when: { i18n: true, example: true, e2e: true },
    overlay: 'i18n-e2e',
    edits: [
      {
        file: 'docs/reference/verifications.md',
        replace: 'and renaming.',
        with: 'and renaming. `e2e/language.spec.ts` switches to French, checks the heading, a counter, `<html lang>` and the title of the page, runs axe, and reloads to check that the choice stays.',
      },
    ],
  },
  {
    when: { coverage: true },
    edits: [
      {
        file: 'vitest.config.ts',
        after: "      setupFiles: ['vitest.setup.ts'],\n",
        insert: COVERAGE_CONFIG,
      },
      {
        file: 'package.json',
        replace: '"test": "vitest run",',
        with: '"test": "vitest run --coverage",',
      },
      { file: '.gitignore', after: 'test-results\n', insert: 'coverage\n' },
      { file: '.prettierignore', after: 'test-results\n', insert: 'coverage\n' },
      {
        file: 'docs/reference/verifications.md',
        before: 'Before keeping a test,',
        insert: COVERAGE_DOC,
      },
      {
        file: 'docs/reference/commands.md',
        replace: 'Vitest: unit tests in Node, component tests in headless Chromium',
        with: 'Vitest: unit tests in Node, component tests in headless Chromium, 90 % coverage',
      },
    ],
    addDevDependencies: { '@vitest/coverage-v8': '5.1.0' },
  },
  {
    when: { i18n: true, 'component-tests': true },
    overlay: 'i18n-component-tests',
  },
  {
    when: { example: false, e2e: true },
    remove: ['e2e/todos.spec.ts'],
    edits: [
      {
        file: 'docs/reference/verifications.md',
        replace:
          ' `e2e/todos.spec.ts` covers the example: the same two checks while a task is being renamed, axe again on the error shown for a blank title, the counters while adding, checking, filtering and clearing tasks, and renaming.',
        with: '',
      },
    ],
  },
  {
    when: { example: false, 'component-tests': true },
    edits: [PRESENTER_TEST_EXAMPLE],
  },
];

export const FRONTEND_SKELETON_ZUSTAND: StackChange[] = [
  {
    when: { example: false, zustand: true },
    edits: [
      {
        file: 'knip.json',
        replace: '"ignoreDependencies": [\n    "@swc/core",\n',
        with: '"ignoreDependencies": [\n    "@swc/core",\n    "zustand",\n',
      },
    ],
  },
];

const FRONTEND_SKELETON_COMPONENT_TESTS: StackChange[] = [
  {
    when: { example: false, 'component-tests': true },
    edits: [
      {
        file: 'knip.json',
        replace: '"ignoreDependencies": [\n    "@swc/core",\n',
        with: '"ignoreDependencies": [\n    "@swc/core",\n    "vitest-browser-react",\n',
      },
    ],
  },
];

export const FRONTEND_I18N_AND_TESTS: StackChange[] = [
  ...FRONTEND_I18N_LOCALES,
  ...FRONTEND_I18N_STYLING,
  ...FRONTEND_I18N_FORMS,
  ...FRONTEND_I18N_E2E_AND_COVERAGE,
  ...FRONTEND_SKELETON_ZUSTAND,
  ...FRONTEND_SKELETON_COMPONENT_TESTS,
];

export const FRONTEND_NO_ZUSTAND: StackChange[] = [
  {
    when: { zustand: false },
    edits: [
      { file: 'docs/concepts/architecture.md', dropSection: '## Store, actions and selectors' },
    ],
    removeDependencies: ['zustand'],
  },
];

export const FRONTEND_TEST_SWITCHES: StackChange[] = [
  {
    when: { 'component-tests': false, example: true },
    remove: ['src/**/*.test.tsx'],
  },
  {
    when: { 'component-tests': false },
    edits: [
      {
        file: 'vitest.config.ts',
        replace: "import { playwright } from '@vitest/browser-playwright';\n",
        with: '',
      },
      {
        file: 'vitest.config.ts',
        replace: `      projects: [\n${UNIT_PROJECT}${COMPONENT_PROJECT}      ],\n`,
        with: `      projects: [\n${UNIT_PROJECT}      ],\n`,
      },
      { file: 'tsconfig.test.json', replace: ', "@vitest/browser-playwright"]', with: ']' },
      {
        file: 'docs/reference/commands.md',
        replace: 'Vitest: unit tests in Node, component tests in headless Chromium',
        with: 'Vitest unit tests, in Node',
      },
      { file: 'docs/reference/verifications.md', dropLines: '| Component |' },
      PRESENTER_TEST_EXAMPLE,
      {
        file: 'docs/reference/verifications.md',
        replace:
          'The extension picks the kind: `.test.ts` runs in Node, `.test.tsx` in Chromium. Only presenters get component tests, since orchestrators read stores and e2e covers them. ',
        with: '',
      },
    ],
    removeScripts: ['test:component'],
    removeDependencies: ['@vitest/browser-playwright', 'vitest-browser-react'],
  },
  {
    when: { 'component-tests': false, ci: true },
    edits: [
      {
        file: '.github/workflows/ci.yml',
        replace: `      - run: npm ci\n${CHROMIUM_LINE}      - run: npm run check`,
        with: '      - run: npm ci\n      - run: npm run check',
      },
    ],
  },
  {
    when: { e2e: false },
    remove: ['e2e', 'playwright.config.ts'],
    edits: [
      {
        file: 'package.json',
        replace: '{{lint}}',
        with: '{{lintWithoutE2e}}',
      },
      { file: 'tsconfig.test.json', replace: '    "e2e",\n', with: '' },
      { file: 'tsconfig.test.json', replace: '    "playwright.config.ts",\n', with: '' },
      {
        file: 'tsconfig.test.json',
        replace: '"@e2e/*": ["./e2e/*"],\n      ',
        with: '',
      },
      {
        file: 'oxlint.config.ts',
        replace:
          "'Relative imports are not allowed: import through an alias (@/ in src/, @test-utils/ in test-utils/, @e2e/ in e2e/).',",
        with: "'Relative imports are not allowed: import through an alias (@/ in src/, @test-utils/ in test-utils/).',",
      },
      { file: 'docs/reference/commands.md', dropLines: '| `npm run e2e` |' },
      {
        file: 'docs/reference/verifications.md',
        replace: " That last one is why `playwright.config.ts` reads `process.env['CI']`.",
        with: '',
      },
      {
        file: 'docs/reference/verifications.md',
        replace: 'on tests, e2e and configs',
        with: 'on tests and configs',
      },
      {
        file: 'docs/reference/verifications.md',
        replace: ', `@e2e/` in `e2e/`',
        with: '',
      },
      { file: 'docs/reference/verifications.md', dropLines: '| E2e |' },
      { file: 'docs/reference/verifications.md', dropLines: 'The specs import `test`' },
    ],
    removeScripts: ['e2e'],
    removeDependencies: [
      '@playwright/test',
      '@axe-core/playwright',
      '@brutalway/playwright-fixtures',
    ],
  },
];

export const FRONTEND_E2E_AND_REPOSITORY: StackChange[] = [
  {
    when: { e2e: false, example: true },
    edits: [
      {
        file: 'docs/guides/start-your-own-app.md',
        replace:
          ', the files in `src/shared/` and `e2e/todos.spec.ts`. `e2e/app.spec.ts` and `e2e/openApp.ts` work on any app whose first screen has an `h1`.',
        with: ' and the files in `src/shared/`.',
      },
    ],
  },
  {
    when: { e2e: false, ci: true },
    edits: [
      { file: '.github/workflows/ci.yml', replace: E2E_JOB, with: '' },
      {
        file: 'docs/reference/commands.md',
        replace: ' in one job and `e2e` in another.',
        with: '.',
      },
    ],
  },
  {
    when: { e2e: false, 'component-tests': true },
    addDevDependencies: { playwright: '1.65.0' },
    edits: [
      {
        file: 'docs/reference/verifications.md',
        replace: CHROMIUM_DOC,
        with: 'Component tests need headless Chromium: `npx playwright install --only-shell chromium`.',
      },
      {
        file: 'docs/reference/verifications.md',
        replace: ', since orchestrators read stores and e2e covers them.',
        with: ', since orchestrators read stores.',
      },
    ],
  },
  {
    when: { e2e: true, 'component-tests': false },
    edits: [
      {
        file: 'docs/reference/verifications.md',
        replace: CHROMIUM_DOC,
        with: 'E2e needs headless Chromium: `npx playwright install --only-shell chromium`.',
      },
    ],
  },
  {
    when: { e2e: false, 'component-tests': false },
    edits: [
      { file: 'docs/reference/verifications.md', replace: ` ${CHROMIUM_DOC}`, with: '' },
      { file: 'README.md', dropLines: 'npx playwright install' },
    ],
  },
  {
    when: { 'claude-hook': false },
    remove: ['.claude', 'docs/guides/work-with-an-agent.md'],
    edits: [
      { file: 'knip.json', replace: '    "@brutalway/agent-hook",\n', with: '' },
      { file: 'README.md', dropLines: 'docs/guides/work-with-an-agent.md' },
    ],
    removeDependencies: ['@brutalway/agent-hook'],
  },
  {
    when: { ci: false },
    remove: ['.github'],
    edits: [
      { file: 'docs/reference/commands.md', dropLines: 'CI (`.github/workflows/ci.yml`)' },
      {
        file: 'docs/reference/verifications.md',
        replace: 'runs locally, in the pre-commit hook and in CI.',
        with: 'runs locally and in the pre-commit hook.',
      },
    ],
  },
];

export const FRONTEND_COMPILER: StackChange[] = [
  {
    when: { styling: 'css-modules' },
    edits: [
      {
        file: 'tsconfig.app.json',
        replace: '"@/*": ["./src/*"]',
        with: '"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]',
      },
      {
        file: 'tsconfig.test.json',
        replace: '"@/*": ["./src/*"]',
        with: '"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]',
      },
    ],
  },
  {
    when: { 'react-compiler': true },
    edits: [
      {
        file: 'oxlint.config.ts',
        replace: '      {\n        patterns: [\n',
        with: REACT_COMPILER_LINT,
      },
    ],
  },
];

export const FRONTEND_ANALYTICS: StackChange[] = [
  {
    when: { analytics: 'module' },
    overlay: 'analytics-module',
    edits: [{ file: 'README.md', before: '## Documentation', insert: ANALYTICS_MODULE_README }],
  },
  {
    when: { analytics: 'posthog' },
    overlay: 'analytics-posthog',
    edits: [
      {
        file: '{{cspFile}}',
        replace: `"connect-src 'self'",`,
        with: `"connect-src 'self' https://*.posthog.com",`,
      },
    ],
    addDependencies: { 'posthog-js': '1.447.3' },
  },
];

export const FRONTEND_ANALYTICS_AND_AGENTS: StackChange[] = [
  {
    when: { analytics: 'module', example: true },
    edits: [
      {
        file: 'src/features/todo-list/components/TodoListLayout.tsx',
        after: "import { useTodoList } from '@/features/todo-list/useTodoList.ts';\n",
        insert: "import { analyticsClient } from '@/shared/analyticsClient.ts';\n",
      },
      {
        file: 'src/features/todo-list/components/TodoListLayout.tsx',
        after: '= useTodoList();\n',
        insert: ANALYTICS_LAYOUT_FUNCTION,
      },
      {
        file: 'src/features/todo-list/components/TodoListLayout.tsx',
        replace: 'onAdd={list.add}',
        with: 'onAdd={addTodo}',
      },
    ],
  },
  {
    when: { analytics: 'posthog', example: true },
    edits: [
      {
        file: 'src/features/todo-list/components/TodoListLayout.tsx',
        after: "import { useTodoList } from '@/features/todo-list/useTodoList.ts';\n",
        insert: "import { analyticsClient } from '@/shared/analyticsClient.ts';\n",
      },
      {
        file: 'src/features/todo-list/components/TodoListLayout.tsx',
        after: '= useTodoList();\n',
        insert: ANALYTICS_LAYOUT_FUNCTION,
      },
      {
        file: 'src/features/todo-list/components/TodoListLayout.tsx',
        replace: 'onAdd={list.add}',
        with: 'onAdd={addTodo}',
      },
    ],
  },
  {
    when: { styling: 'tailwind' },
    edits: [
      {
        file: 'AGENTS.md',
        replace:
          '- Styles go in one stylesheet per feature, and a color is a `var()` of a token of `src/app/globals.css`.',
        with: '- Styles are Tailwind classes built on the tokens declared under `@theme` in `src/app/globals.css`: no palette class, no arbitrary color.',
      },
      {
        file: 'AGENTS.md',
        replace: 'Oxlint, stylelint, dependency-cruiser',
        with: 'Oxlint, dependency-cruiser',
      },
    ],
  },
  {
    when: { styling: 'css-modules' },
    edits: [
      {
        file: 'AGENTS.md',
        replace:
          '- Styles go in one stylesheet per feature, and a color is a `var()` of a token of `src/app/globals.css`.',
        with: '- A component with styles has its `X.module.css` next to it, and a color is a `var()` of a token of `src/app/globals.css`.',
      },
    ],
  },
  {
    when: { ui: 'shadcn' },
    edits: [
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert:
          '- Controls come from the shadcn/ui primitives in `third-party/shadcn/`, imported through `@third-party/shadcn/`. Never edit that folder: run `npx shadcn add <name>`, restyle through `src/app/globals.css`, or wrap the primitive in `src/`.\n',
      },
    ],
  },
];

export const FRONTEND_AGENTS: StackChange[] = [
  {
    when: { forms: true },
    edits: [
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert: '- A form validates through its Zod schema and `zodResolver`, nowhere else.\n',
      },
    ],
  },
  {
    when: { i18n: true },
    edits: [
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert:
          '- Every key exists in English and in French, `npm run messages` fails otherwise.\n',
      },
    ],
  },
  {
    when: { 'react-compiler': true },
    edits: [
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert:
          '- The React Compiler memoizes components and hooks: no `useMemo`, `useCallback` or `memo`.\n',
      },
    ],
  },
  {
    when: { analytics: 'module' },
    edits: [
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert: '- Events leave the app through `src/shared/analyticsClient.ts` only.\n',
      },
    ],
  },
  {
    when: { analytics: 'posthog' },
    edits: [
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert: '- Events leave the app through `src/shared/analyticsClient.ts` only.\n',
      },
    ],
  },
];

const FRONTEND_THEME: StackChange[] = [
  {
    when: { 'dark-theme': true, styling: 'css' },
    edits: [
      { file: 'src/app/globals.css', replace: '  color-scheme: light;\n}\n', with: DARK_TOKENS },
    ],
  },
  {
    when: { 'dark-theme': true, styling: 'css-modules' },
    edits: [
      { file: 'src/app/globals.css', replace: '  color-scheme: light;\n}\n', with: DARK_TOKENS },
    ],
  },
  {
    when: { 'dark-theme': true, styling: 'tailwind' },
    edits: [
      {
        file: 'src/app/globals.css',
        replace: '  html {\n    color-scheme: light;\n  }',
        with: DARK_TAILWIND_TOKENS,
      },
    ],
  },
  {
    when: { 'dark-theme': true },
    edits: [
      { file: 'README.md', before: 'Part of [brutalway]', insert: DARK_THEME_README },
      {
        file: 'AGENTS.md',
        before: '- No comments,',
        insert:
          '- Colors follow the theme of the system: a token gets its dark value in the `prefers-color-scheme: dark` block of `src/app/globals.css`, never in a component.\n',
      },
    ],
  },
  {
    when: { 'dark-theme': true, e2e: true, example: true },
    overlay: 'dark-theme-e2e-example',
  },
  {
    when: { 'dark-theme': true, e2e: true, example: false },
    overlay: 'dark-theme-e2e',
  },
  {
    when: { e2e: false },
    edits: [
      {
        file: 'AGENTS.md',
        replace: 'Then run `npm test`, and `npm run e2e` when the change shows on screen.',
        with: 'Then run `npm test`.',
      },
    ],
  },
  {
    when: { ui: 'shadcn' },
    edits: [
      {
        file: 'tsconfig.app.json',
        replace: '"@/*": ["./src/*"]',
        with: '"@/*": ["./src/*"],\n      "@third-party/*": ["./third-party/*"]',
      },
      {
        file: 'tsconfig.test.json',
        replace: '"@/*": ["./src/*"]',
        with: '"@/*": ["./src/*"],\n      "@third-party/*": ["./third-party/*"]',
      },
    ],
  },
];

export const FRONTEND_AGENTS_AND_THEME: StackChange[] = [...FRONTEND_AGENTS, ...FRONTEND_THEME];

export const FRONTEND_SERVER_STATE: StackChange[] = [
  {
    when: { 'server-state': true },
    overlay: 'server-state',
    edits: [
      {
        file: 'oxlint.config.ts',
        after: '{{presetImport}}\n',
        insert: "import { tanstackQueryConfig } from '@brutalway/oxlint-config-tanstack-query';\n",
      },
      {
        file: 'oxlint.config.ts',
        replace: 'extends: [{{preset}}',
        with: 'extends: [{{preset}}, tanstackQueryConfig',
      },
      {
        file: 'docs/reference/verifications.md',
        after: '{{testsLintLine}}\n',
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
    remove: ['src/shared/QueryConfig.ts'],
    keep: ['src/shared'],
    edits: ['docs/reference/verifications.md', 'docs/concepts/architecture.md'].map((file) => ({
      file,
      replace: '`src/shared/QueryConfig.ts`',
      with: '`src/features/query-client/QueryConfig.ts`',
      all: true,
    })),
    overlay: 'server-state-skeleton',
  },
];

export const FRONTEND_FORMS_SERVER_STATE: StackChange[] = [
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
];

export const FRONTEND_COMPILER_EXAMPLE: StackChange[] = [
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
];

export const FRONTEND_SERVER_STATE_AGENTS: StackChange[] = [
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
];
