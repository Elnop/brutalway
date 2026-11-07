import type { Stack } from '../StackTypes.ts';
import { SHADCN_DEPENDENCIES, SHADCN_VERSION } from './shadcnConfig.ts';

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

const UNIT_PROJECT = "{ extends: true, test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] } }";

const COMPONENT_PROJECT = `        {
          extends: true,
          test: {
            name: 'component',
            include: ['src/**/*.test.tsx'],
            browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] },
          },
        },
`;

const PRESENTER_TEST_EXAMPLE = { file: 'docs/architecture.md', replace: ', as `src/features/todo-list/components/presenters/TodoInput.test.tsx` does,', with: ',' };

const TAILWIND_DOC = `\`oxlint.config.ts\` also extends \`@brutalway/oxlint-config-tailwind\`. A color is a token declared under \`@theme\` in \`src/app/globals.css\`: no \`bg-white\`, no \`bg-[#0f0f0f]\`, no hex in \`style\`, and the message names the closest tokens. \`h1\` to \`h3\` take \`font-display\`, \`code\` and \`pre\` take \`font-mono\`, and \`dark:\` is reported, since the project is light only. Prettier sorts the classes with \`prettier-plugin-tailwindcss\`, through \`@brutalway/prettier-config/tailwind\`.

`;

const CSS_MODULES_DOC = `A component with styles has its own \`X.module.css\` next to it and reads it with \`import styles from '@/features/x/X.module.css'\`. On these files the config also reports a stylesheet without its \`X.tsx\` beside it, a class the component never uses, and a class not written in camelCase. \`npm run typecheck\` first runs \`happy-css-modules\`, which writes one \`.d.ts\` per stylesheet into \`node_modules/.cache/css-modules\`, so \`styles.typo\` is a tsc error. After adding a class, run \`npm run css-types\` (or \`npm run css-types -- --watch\`) so the editor sees it.

`;

const CSS_MODULES_TYPES = "hcm 'src/**/*.module.css' --outDir node_modules/.cache/css-modules --no-declarationMap --no-cache --logLevel silent";

const STYLELINT_SETTINGS = '  "stylelint": {\n    "extends": "@brutalway/stylelint-config"\n  },\n';

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
  --color-primary-foreground: var(--color-ink);
  --color-secondary: var(--color-paper);
  --color-secondary-foreground: var(--color-ink);
  --color-destructive: var(--color-pink);
  --color-accent: var(--color-yellow);
  --color-accent-foreground: var(--color-ink);
  --color-card: var(--color-paper);
  --color-card-foreground: var(--color-ink);
  --color-muted-foreground: var(--color-ink);
  --color-border: var(--color-ink);
  --color-input: var(--color-ink);
  --color-ring: var(--color-blue);
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
  }

`;

const SHADCN_README = `## UI primitives

The buttons, fields, checkboxes and cards come from [shadcn/ui](https://ui.shadcn.com). The shadcn CLI copied their files into \`third-party/shadcn/\`, and they stay as the registry wrote them, so \`npx shadcn add <name> --overwrite\` can replace them at any time. The code in \`src/\` imports them through \`@third-party/shadcn/\`.

To add one, run \`npx shadcn add <name>\` (\`dialog\`, \`select\`, \`tabs\`...), then check \`package.json\`: the CLI sometimes misses a package the file imports, and sometimes installs one no file imports (\`date-fns\` with \`calendar\`). knip reports both. A primitive with an animation (\`dialog\`, \`dropdown-menu\`, \`sheet\`...) also needs \`npm install -E tw-animate-css\` and \`@import 'tw-animate-css';\` in \`src/app/globals.css\`, which the CLI does not write since the project owns that file.

To change how a primitive looks, leave its file alone. shadcn's colors are mapped onto the project's under \`@theme inline\` in \`src/app/globals.css\`, where the tokens also make every border thick, every corner square and every shadow hard. Beyond that, add a rule on the primitive's \`data-slot\` in the same file, pass a class from the component that uses it, or write a component in \`src/shared/\` that wraps it.

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

const I18N_README = `The example comes in English and French. The buttons in the header switch between them through \`src/features/language-switch/LanguageSwitch.tsx\`, the languages are listed in \`src/features/language-switch/LanguagesConfig.ts\`, and \`src/features/language-switch/languagePreference.ts\` starts from the language saved in \`localStorage\`, or else the first one of the browser that the project has, and keeps \`<html lang>\` and the title of the page in line with it. To add a language, add it to \`src/features/language-switch/LanguagesConfig.ts\`, add its folder next to \`src/app/locales/en/\`, import its files in \`src/app/createI18n.ts\` and list it under \`locales\` in \`i18next.config.ts\`.`;

const CHROMIUM_DOC = 'Component tests and e2e need headless Chromium: `npx playwright install --only-shell chromium`.';

export const viteStack: Stack = {
  id: 'vite',
  label: 'Vite + React',
  directory: 'templates/vite',
  options: [
    { id: 'example', message: 'Keep the todo list example?', default: true, requires: { zustand: true } },
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
        { id: 'shadcn', label: 'shadcn/ui, vendored in third-party/shadcn/ (needs Tailwind)', requires: { styling: 'tailwind' } },
      ],
    },
    { id: 'server-state', message: 'Read and write the data through an API with TanStack Query?', default: false },
    { id: 'forms', message: 'Validate the forms with react-hook-form and Zod?', default: false },
    { id: 'i18n', message: 'Add French and a language switch?', default: false },
    { id: 'component-tests', message: 'Add component tests (Vitest in Chromium)?', default: true },
    { id: 'e2e', message: 'Add e2e tests (Playwright)?', default: true },
    { id: 'claude-hook', message: 'Add the Claude Code hook that lints each edited file?', default: true, independent: true },
    { id: 'ci', message: 'Add the GitHub Actions workflow?', default: true },
  ],
  changes: [
    {
      when: {},
      remove: ['CHANGELOG.md'],
      edits: [{ file: 'README.md', replace: '# template-vite\n', with: '# __PROJECT_NAME__\n' }],
    },
    {
      when: { example: false },
      remove: [
        'src/features',
        'src/shared-features/todos',
        'src/shared/normalizeTitle.ts',
        'src/shared/normalizeTitle.test.ts',
        'src/app/locales/en/todoList.json',
        'src/app/locales/en/todoStats.json',
      ],
      edits: [
        { file: 'index.html', replace: '<title>Todos</title>', with: '<title>__PROJECT_NAME__</title>' },
        {
          file: 'README.md',
          replace: 'The example app is a todo list. It is there so every rule has real code to check: delete it and keep the structure. The look',
          with: 'The look',
        },
        {
          file: 'README.md',
          replace:
            'In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`. ',
          with: '',
        },
        { file: 'README.md', dropLines: '1. Delete `src/features/`' },
        { file: 'README.md', replace: 'each slice has its own namespace (`app`, `todoList`, `todoStats`)', with: 'each slice gets its own namespace, `app` for now' },
        { file: 'README.md', replace: '2. Write your first feature', with: '1. Write your first feature' },
        { file: 'README.md', replace: '3. Run `npm run check` often', with: '2. Run `npm run check` often' },
        { file: 'docs/verifications.md', replace: '`src/shared/normalizeTitle.test.ts` next to its source', with: 'next to its source' },
        { file: 'docs/verifications.md', replace: '`src/features/todo-list/components/presenters/TodoInput.test.tsx`', with: 'next to the presenter' },
        {
          file: 'docs/architecture.md',
          replace:
            ' `src/features/todo-list/components/TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts` and hands them to the presenters in `src/features/todo-list/components/presenters/`.',
          with: '',
        },
        { file: 'docs/architecture.md', dropLines: 'Renaming a task is a sub-feature of the list' },
        {
          file: 'docs/architecture.md',
          replace:
            '`src/shared-features/todos/todosStore.ts` only exports `todosStore` and `todosActions`, `src/shared-features/todos/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared-features/todos/useTodos.ts`.',
          with: 'An `xStore.ts` only exports `xStore` and `xActions`, an `xSelectors.ts` only exports `selectX` functions, and components read the store through a `useX.ts` hook.',
        },
      ],
      overlay: 'skeleton',
      keep: ['src/features', 'src/shared-features', 'src/shared'],
    },
    {
      when: { styling: 'tailwind' },
      overlay: 'tailwind',
      edits: [
        { file: 'vite.config.ts', after: "import react from '@vitejs/plugin-react';\n", insert: "import tailwindcss from '@tailwindcss/vite';\n" },
        { file: 'vite.config.ts', replace: 'plugins: [react()]', with: 'plugins: [react(), tailwindcss()]' },
        {
          file: 'oxlint.config.ts',
          after: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';\n",
          insert: "import { tailwindConfig } from '@brutalway/oxlint-config-tailwind';\n",
        },
        { file: 'oxlint.config.ts', replace: 'extends: [reactViteConfig', with: 'extends: [reactViteConfig, tailwindConfig' },
        { file: 'package.json', replace: '"prettier": "@brutalway/prettier-config"', with: '"prettier": "@brutalway/prettier-config/tailwind"' },
        {
          file: 'README.md',
          replace: 'easy to swap: the tokens are at the top of `src/app/globals.css`.',
          with: 'easy to swap: the colors, fonts and shadows are tokens declared under `@theme` in `src/app/globals.css`, and the components style themselves with Tailwind classes built on them.',
        },
        { file: 'docs/verifications.md', before: '## Dependencies', insert: TAILWIND_DOC },
        { file: 'docs/verifications.md', dropSection: '## Styles' },
        { file: 'package.json', replace: STYLELINT_SETTINGS, with: '' },
        { file: 'package.json', replace: 'npm run lint && npm run styles && ', with: 'npm run lint && ' },
        { file: 'README.md', replace: 'Oxlint, stylelint, dependency-cruiser', with: 'Oxlint, dependency-cruiser' },
      ],
      removeScripts: ['styles'],
      removeDependencies: ['stylelint', '@brutalway/stylelint-config'],
      addDevDependencies: {
        '@brutalway/oxlint-config-tailwind': '0.1.0',
        '@brutalway/prettier-config': '0.2.0',
        '@tailwindcss/vite': '4.3.3',
        'prettier-plugin-tailwindcss': '0.8.1',
        tailwindcss: '4.3.3',
      },
    },
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
        { file: 'src/app/globals.css', replace: '  --shadow-hard-sm: 4px 4px 0 var(--color-ink);\n}', with: SHADCN_THEME },
        { file: 'src/app/globals.css', before: '  :focus-visible {', insert: SHADCN_SLOTS },
        {
          file: 'vite.config.ts',
          replace: "alias: [{ find: /^@\\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) }],",
          with: "alias: [\n      { find: /^@\\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },\n      { find: /^@third-party\\//u, replacement: fileURLToPath(new URL('./third-party/', import.meta.url)) },\n    ],",
        },
        {
          file: 'tsconfig.json',
          replace: '{\n  "files": [],\n  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.test.json" }]',
          with: '{\n  "compilerOptions": {\n    "paths": { "@third-party/*": ["./third-party/*"] }\n  },\n  "files": [],\n  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.test.json" }, { "path": "./tsconfig.third-party.json" }]',
        },
        { file: 'tsconfig.app.json', before: '  "include": [', insert: THIRD_PARTY_REFERENCES },
        { file: 'tsconfig.test.json', before: '  "include": [', insert: THIRD_PARTY_REFERENCES },
        { file: 'package.json', replace: 'tsc -p tsconfig.app.json && tsc -p tsconfig.test.json"', with: 'tsc -b tsconfig.app.json tsconfig.test.json"' },
        { file: '.prettierignore', before: 'dist\n', insert: 'components.json\n' },
        { file: '.prettierignore', after: 'test-results\n', insert: 'third-party\n' },
        { file: 'knip.json', replace: '"entry": ["i18next.config.ts"]', with: '"entry": ["i18next.config.ts", "third-party/**/*.{ts,tsx}"]' },
        { file: 'knip.json', replace: '"ignoreDependencies": ["@swc/core", ', with: '"ignoreDependencies": ["@swc/core", "shadcn", ' },
        { file: 'oxlint.config.ts', replace: "ignorePatterns: ['dist']", with: "ignorePatterns: ['dist', 'third-party']" },
        { file: '.alint.yml', replace: "prefixes: ['src/',", with: "prefixes: ['src/', 'third-party/'," },
        { file: '.alint.yml', after: '    level: error\n', insert: THIRD_PARTY_ALINT },
        { file: 'README.md', before: '## Commands', insert: SHADCN_README },
        { file: 'README.md', replace: '| `npm run check` | Prettier, both `tsc` projects,', with: '| `npm run check` | Prettier, the three `tsc` projects,' },
        { file: 'docs/verifications.md', before: '## Lint', insert: SHADCN_TYPESCRIPT_DOC },
        { file: 'docs/verifications.md', before: '## Tests', insert: SHADCN_VERIFICATIONS_DOC },
        { file: '.dependency-cruiser.cjs', replace: "extends: '@brutalway/dependency-cruiser-config/layers'", with: "extends: '@brutalway/dependency-cruiser-config/shadcn'" },
        { file: 'package.json', replace: '"deps": "depcruise src"', with: '"deps": "depcruise src third-party"' },
        {
          file: 'oxlint.config.ts',
          after: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';\n",
          insert: "import { shadcnConfig } from '@brutalway/oxlint-config-shadcn';\n",
        },
        { file: 'oxlint.config.ts', replace: 'extends: [reactViteConfig', with: 'extends: [reactViteConfig, shadcnConfig' },
        { file: 'docs/verifications.md', after: '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)\n', insert: SHADCN_LINT_DOC },
        {
          file: 'docs/verifications.md',
          after: '- a store lives at the root or in the `stores/` folder of its level\n',
          insert: '- `third-party/` imports nothing from `src/`, and `radix-ui` and `class-variance-authority` are only imported from `third-party/`: `src/` uses the primitives\n',
        },
      ],
      addDependencies: SHADCN_DEPENDENCIES,
      addDevDependencies: { '@brutalway/dependency-cruiser-config': '0.5.0', '@brutalway/oxlint-config-shadcn': '0.1.0', '@brutalway/tsconfig': '0.3.0', shadcn: SHADCN_VERSION },
    },
    {
      when: { ui: 'shadcn', example: true },
      overlay: 'shadcn-example',
    },
    {
      when: { ui: 'shadcn', 'claude-hook': true },
      edits: [
        { file: '.claude/settings.json', replace: '"hooks": {\n    "PostToolUse": [', with: `"hooks": {\n${VENDORED_PRE_TOOL_USE}    "PostToolUse": [` },
        { file: '.claude/settings.json', replace: 'brutal-agent-hook --tree src"', with: 'brutal-agent-hook --tree src --vendored third-party"' },
        {
          file: 'README.md',
          replace: 'Every message says what to change, so the agent does not need to know the convention beforehand.',
          with: 'Every message says what to change, so the agent does not need to know the convention beforehand. Before an edit, the same hook refuses any change to a file in `third-party/` and tells the agent to run `npx shadcn add <name> --overwrite`, restyle through `src/app/globals.css` or wrap the primitive in `src/`.',
        },
      ],
      addDevDependencies: { '@brutalway/agent-hook': '0.2.0' },
    },
    {
      when: { styling: 'css-modules' },
      overlay: 'css-modules',
      edits: [
        { file: 'package.json', replace: '"typecheck": "i18next-cli types --quiet && tsc -p', with: '"typecheck": "i18next-cli types --quiet && npm run css-types && tsc -p' },
        {
          file: 'package.json',
          after: '"typecheck": "i18next-cli types --quiet && npm run css-types && tsc -p tsconfig.app.json && tsc -p tsconfig.test.json",\n',
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
        { file: 'docs/verifications.md', before: '## Dependencies', insert: CSS_MODULES_DOC },
        {
          file: 'docs/verifications.md',
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
    {
      when: { 'server-state': true },
      overlay: 'server-state',
      edits: [
        {
          file: 'oxlint.config.ts',
          after: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';\n",
          insert: "import { tanstackQueryConfig } from '@brutalway/oxlint-config-tanstack-query';\n",
        },
        { file: 'oxlint.config.ts', replace: 'extends: [reactViteConfig', with: 'extends: [reactViteConfig, tanstackQueryConfig' },
        { file: 'docs/verifications.md', after: '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)\n', insert: SERVER_STATE_LINT_DOC },
        {
          file: 'docs/verifications.md',
          replace: '- a presenter imports no store and no shared-feature hook\n',
          with: '- a presenter imports no store, no shared-feature hook, no `xClient.ts` and no `@tanstack/react-query`\n- a store imports no `xClient.ts`, no `xKeys.ts` and no hook: it only holds UI state\n',
        },
        { file: 'docs/architecture.md', before: '## Sub-features', insert: SERVER_STATE_ARCHITECTURE },
      ],
      addDependencies: { '@tanstack/react-query': '5.107.1' },
      addDevDependencies: { '@brutalway/oxlint-config-tanstack-query': '0.1.0' },
    },
    {
      when: { 'server-state': true, example: false },
      remove: ['src/shared/.gitkeep'],
    },
    {
      when: { 'server-state': true, example: true },
      overlay: 'server-state-example',
      remove: ['src/shared-features/todos/useTodos.ts', 'src/shared-features/todos/todosSelectors.ts', 'src/shared-features/todos/todosSelectors.test.ts'],
      edits: [
        { file: 'vite.config.ts', after: "import react from '@vitejs/plugin-react';\n", insert: "import { devApi } from './devApi.ts';\n" },
        { file: 'vite.config.ts', replace: 'plugins: [react()', with: 'plugins: [react(), devApi()' },
        { file: 'README.md', before: '## Commands', insert: SERVER_STATE_README },
        {
          file: 'README.md',
          replace: '`src/shared-features/todos/` holds the tasks and the current filter,',
          with: '`src/shared-features/todos/` holds the client of the todo API, its query hooks and the current filter,',
        },
        {
          file: 'docs/architecture.md',
          replace: ', `src/shared-features/todos/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared-features/todos/useTodos.ts`.',
          with: ', and components read the store through `src/shared-features/todos/hooks/useTodos.ts`. The store only holds the filter: the todos and the counters come from the API (see Server state below).',
        },
      ],
      addDependencies: { zod: '4.6.7' },
    },
    {
      when: { forms: true },
      edits: [
        {
          file: 'oxlint.config.ts',
          after: "import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';\n",
          insert: "import { reactHookFormConfig } from '@brutalway/oxlint-config-react-hook-form';\n",
        },
        { file: 'oxlint.config.ts', replace: 'extends: [reactViteConfig', with: 'extends: [reactViteConfig, reactHookFormConfig' },
        { file: 'docs/verifications.md', after: '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)\n', insert: FORMS_LINT_DOC },
      ],
      addDependencies: { '@hookform/resolvers': '5.9.2', 'react-hook-form': '7.91.0', zod: '4.6.7' },
      addDevDependencies: { '@brutalway/oxlint-config-react-hook-form': '0.1.0' },
    },
    {
      when: { forms: true, example: false },
      edits: [{ file: 'knip.json', replace: '"ignoreDependencies": ["@swc/core", ', with: '"ignoreDependencies": ["@swc/core", "@hookform/resolvers", "react-hook-form", "zod", ' }],
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
          insert: "import { normalizeTitle } from '@/shared/normalizeTitle.ts';\nimport { TITLE_ERRORS } from '@/shared-features/todos/TodosConfig.ts';\n",
        },
        {
          file: 'src/shared-features/todos/TodosSchemas.ts',
          after: 'export const ClearedSchema = z.object({ deleted: z.number().int().min(0) });\n',
          insert: '\nexport const TodoDraftSchema = z.object({\n  title: z.string().transform(normalizeTitle).pipe(z.string().min(1, TITLE_ERRORS[0]).max(200, TITLE_ERRORS[1])),\n});\n',
        },
        { file: 'src/shared-features/todos/TodosTypes.ts', replace: 'import type { TodoFilterSchema, TodoSchema } from', with: 'import type { TodoDraftSchema, TodoFilterSchema, TodoSchema } from' },
        {
          file: 'src/shared-features/todos/TodosTypes.ts',
          after: 'export type TodoFilter = z.infer<typeof TodoFilterSchema>;\n',
          insert: '\nexport type TodoDraft = z.output<typeof TodoDraftSchema>;\n',
        },
        { file: 'src/shared-features/todos/todosClient.ts', replace: 'import type { Todo, TodoFilter, TodoUpdate }', with: 'import type { Todo, TodoDraft, TodoFilter, TodoUpdate }' },
        {
          file: 'src/shared-features/todos/todosClient.ts',
          replace: "create: async (title: string) => request(TodoSchema, 'POST', '/todos', { title }),",
          with: "create: async (draft: TodoDraft) => request(TodoSchema, 'POST', '/todos', draft),",
        },
        { file: 'src/features/todo-list/useTodoList.ts', replace: 'return { todos, filter, add, setFilter', with: 'return { todos, filter, add: (title: string) => add({ title }), setFilter' },
      ],
    },
    {
      when: { i18n: true },
      overlay: 'i18n',
      edits: [
        { file: 'src/app/locales/en/app.json', after: '{\n', insert: '  "language": "Language",\n  "languages": { "en": "English", "fr": "Français" },\n' },
        { file: 'src/app/createI18n.ts', replace: '      en: {', with: '      fr: FRENCH,\n      en: {' },
        { file: 'i18next.config.ts', replace: "locales: ['en'],", with: "locales: ['en', 'fr']," },
        { file: 'src/main.tsx', after: "import { createI18n } from '@/app/createI18n.ts';\n", insert: "import { followLanguage, preferredLanguage } from '@/features/language-switch/languagePreference.ts';\n" },
        { file: 'src/main.tsx', replace: 'const i18n = createI18n();', with: 'const i18n = createI18n(preferredLanguage());\nfollowLanguage(i18n);' },
        { file: 'src/app/App.tsx', after: "import { useTranslation } from 'react-i18next';\n", insert: "import { LanguageSwitch } from '@/features/language-switch/LanguageSwitch.tsx';\n" },
        { file: 'src/app/App.tsx', before: '      </header>', insert: '        <LanguageSwitch />\n' },
        {
          file: 'README.md',
          replace: 'To add a language, add its folder next to `src/app/locales/en/`, import its files in `src/app/createI18n.ts` and list it under `locales` in `i18next.config.ts`.',
          with: I18N_README,
        },
      ],
    },
    {
      when: { i18n: true, example: true },
      overlay: 'i18n-example',
      edits: [
        {
          file: 'src/app/createI18n.ts',
          after: "import todoStats from '@/app/locales/en/todoStats.json';\n",
          insert: "import frApp from '@/app/locales/fr/app.json';\nimport frTodoList from '@/app/locales/fr/todoList.json';\nimport frTodoStats from '@/app/locales/fr/todoStats.json';\n",
        },
        { file: 'src/app/createI18n.ts', replace: 'fr: FRENCH,', with: 'fr: { app: frApp, todoList: frTodoList, todoStats: frTodoStats },' },
      ],
    },
    {
      when: { i18n: true, example: false },
      overlay: 'i18n-skeleton',
      remove: ['src/features/.gitkeep'],
      edits: [
        { file: 'src/app/createI18n.ts', after: "import app from '@/app/locales/en/app.json';\n", insert: "import frApp from '@/app/locales/fr/app.json';\n" },
        { file: 'src/app/createI18n.ts', replace: 'fr: FRENCH,', with: 'fr: { app: frApp },' },
      ],
    },
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
    {
      when: { i18n: true, example: true, forms: true },
      edits: [
        { file: 'src/app/locales/fr/todoList.json', replace: '"blankTitle": "Le titre est vide"', with: '"blankTitle": "Le titre est vide",\n    "longTitle": "Le titre fait au plus 200 caractères"' },
      ],
    },
    {
      when: { i18n: true, example: true, e2e: true },
      overlay: 'i18n-e2e',
      edits: [
        {
          file: 'docs/verifications.md',
          replace: 'and renaming.',
          with: 'and renaming. `e2e/language.spec.ts` switches to French, checks the heading, a counter, `<html lang>` and the title of the page, runs axe, and reloads to check that the choice stays.',
        },
      ],
    },
    {
      when: { example: false, e2e: true },
      remove: ['e2e/todos.spec.ts'],
      edits: [
        {
          file: 'docs/verifications.md',
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
    {
      when: { example: false, zustand: true },
      edits: [{ file: 'knip.json', replace: '"ignoreDependencies": ["@swc/core", ', with: '"ignoreDependencies": ["@swc/core", "zustand", ' }],
    },
    {
      when: { example: false, 'component-tests': true },
      edits: [{ file: 'knip.json', replace: '"ignoreDependencies": ["@swc/core", ', with: '"ignoreDependencies": ["@swc/core", "vitest-browser-react", ' }],
    },
    {
      when: { zustand: false },
      edits: [{ file: 'docs/architecture.md', dropSection: '## Store, actions and selectors' }],
      removeDependencies: ['zustand'],
    },
    {
      when: { 'component-tests': false, example: true },
      remove: ['src/**/*.test.tsx'],
    },
    {
      when: { 'component-tests': false },
      edits: [
        { file: 'vitest.config.ts', replace: "import { playwright } from '@vitest/browser-playwright';\n", with: '' },
        { file: 'vitest.config.ts', replace: `      projects: [\n        ${UNIT_PROJECT},\n${COMPONENT_PROJECT}      ],\n`, with: `      projects: [${UNIT_PROJECT}],\n` },
        { file: 'tsconfig.test.json', replace: ', "@vitest/browser-playwright"]', with: ']' },
        { file: 'README.md', replace: 'Vitest: unit tests in Node, component tests in headless Chromium', with: 'Vitest unit tests, in Node' },
        { file: 'docs/verifications.md', dropLines: '| Component |' },
        PRESENTER_TEST_EXAMPLE,
        {
          file: 'docs/verifications.md',
          replace: 'The extension picks the kind: `.test.ts` runs in Node, `.test.tsx` in Chromium. Only presenters get component tests, since orchestrators read stores and e2e covers them. ',
          with: '',
        },
      ],
      removeScripts: ['test:component'],
      removeDependencies: ['@vitest/browser-playwright', 'vitest-browser-react'],
    },
    {
      when: { 'component-tests': false, ci: true },
      edits: [{ file: '.github/workflows/ci.yml', replace: `      - run: npm ci\n${CHROMIUM_LINE}      - run: npm run check`, with: '      - run: npm ci\n      - run: npm run check' }],
    },
    {
      when: { e2e: false },
      remove: ['e2e', 'playwright.config.ts'],
      edits: [
        {
          file: 'package.json',
          replace: 'oxlint --type-aware src e2e oxlint.config.ts vite.config.ts vitest.config.ts vitest.setup.ts playwright.config.ts i18next.config.ts',
          with: 'oxlint --type-aware src oxlint.config.ts vite.config.ts vitest.config.ts vitest.setup.ts i18next.config.ts',
        },
        { file: 'tsconfig.test.json', replace: '"node_modules/.cache/i18next", "e2e",', with: '"node_modules/.cache/i18next",' },
        { file: 'tsconfig.test.json', replace: ' "playwright.config.ts",', with: '' },
        { file: 'tsconfig.test.json', replace: '"@/*": ["./src/*"],\n      "@e2e/*": ["./e2e/*"]', with: '"@/*": ["./src/*"]' },
        { file: 'oxlint.config.ts', replace: 'import through an alias (@/ in src/, @e2e/ in e2e/).', with: 'import through the @/ alias.' },
        { file: 'README.md', dropLines: '| `npm run e2e` |' },
        { file: 'docs/verifications.md', replace: " That last one is why `playwright.config.ts` reads `process.env['CI']`.", with: '' },
        { file: 'docs/verifications.md', replace: 'on tests, e2e and configs', with: 'on tests and configs' },
        { file: 'docs/verifications.md', replace: '`@/` in `src/`, `@e2e/` in `e2e/`', with: '`@/` in `src/`' },
        { file: 'docs/verifications.md', dropLines: '| E2e |' },
        { file: 'docs/verifications.md', dropLines: 'The specs import `test`' },
      ],
      removeScripts: ['e2e'],
      removeDependencies: ['@playwright/test', '@axe-core/playwright', '@brutalway/playwright-fixtures'],
    },
    {
      when: { e2e: false, example: true },
      edits: [
        {
          file: 'README.md',
          replace: ', the files in `src/shared/` and `e2e/todos.spec.ts`. `e2e/app.spec.ts` and `e2e/openApp.ts` work on any app whose first screen has an `h1`.',
          with: ' and the files in `src/shared/`.',
        },
      ],
    },
    {
      when: { e2e: false, ci: true },
      edits: [
        { file: '.github/workflows/ci.yml', replace: E2E_JOB, with: '' },
        { file: 'README.md', replace: ' in one job and `e2e` in another.', with: '.' },
      ],
    },
    {
      when: { e2e: false, 'component-tests': true },
      addDevDependencies: { playwright: '1.64.1' },
      edits: [
        { file: 'docs/verifications.md', replace: CHROMIUM_DOC, with: 'Component tests need headless Chromium: `npx playwright install --only-shell chromium`.' },
        { file: 'docs/verifications.md', replace: ', since orchestrators read stores and e2e covers them.', with: ', since orchestrators read stores.' },
      ],
    },
    {
      when: { e2e: true, 'component-tests': false },
      edits: [{ file: 'docs/verifications.md', replace: CHROMIUM_DOC, with: 'E2e needs headless Chromium: `npx playwright install --only-shell chromium`.' }],
    },
    {
      when: { e2e: false, 'component-tests': false },
      edits: [
        { file: 'docs/verifications.md', replace: ` ${CHROMIUM_DOC}`, with: '' },
        { file: 'README.md', dropLines: 'npx playwright install' },
      ],
    },
    {
      when: { 'claude-hook': false },
      remove: ['.claude'],
      edits: [
        { file: 'knip.json', replace: '"@brutalway/agent-hook", ', with: '' },
        { file: 'README.md', dropSection: '## Working with an agent' },
      ],
      removeDependencies: ['@brutalway/agent-hook'],
    },
    {
      when: { ci: false },
      remove: ['.github'],
      edits: [
        { file: 'README.md', dropLines: 'CI (`.github/workflows/ci.yml`)' },
        { file: 'docs/verifications.md', replace: 'runs locally, in the pre-commit hook and in CI.', with: 'runs locally and in the pre-commit hook.' },
      ],
    },
    {
      when: { 'server-state': true, example: true },
      edits: [
        { file: 'package.json', replace: 'oxlint.config.ts vite.config.ts', with: 'oxlint.config.ts vite.config.ts devApi.ts' },
        { file: 'tsconfig.test.json', replace: '"vite.config.ts",', with: '"vite.config.ts", "devApi.ts",' },
      ],
    },
    {
      when: { styling: 'css-modules' },
      edits: [
        { file: 'tsconfig.app.json', replace: '"@/*": ["./src/*"]', with: '"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]' },
        { file: 'tsconfig.test.json', replace: '"@/*": ["./src/*"]', with: '"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]' },
      ],
    },
    {
      when: { ui: 'shadcn' },
      edits: [
        { file: 'tsconfig.app.json', replace: '"@/*": ["./src/*"]', with: '"@/*": ["./src/*"],\n      "@third-party/*": ["./third-party/*"]' },
        { file: 'tsconfig.test.json', replace: '"@/*": ["./src/*"]', with: '"@/*": ["./src/*"],\n      "@third-party/*": ["./third-party/*"]' },
      ],
    },
  ],
  nextSteps: (answers) => [...(answers['e2e'] || answers['component-tests'] ? ['npx playwright install --only-shell chromium'] : []), 'npm run dev'],
};
