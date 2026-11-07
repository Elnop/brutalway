import type { Stack } from '../StackTypes.ts';

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
      remove: ['src/features', 'src/shared-features/todos', 'src/shared/lib'],
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
        { file: 'README.md', replace: '2. Write your first feature', with: '1. Write your first feature' },
        { file: 'README.md', replace: '3. Run `npm run check` often', with: '2. Run `npm run check` often' },
        { file: 'docs/verifications.md', replace: '`src/shared/lib/normalizeTitle.test.ts` next to its source', with: 'next to its source' },
        { file: 'docs/verifications.md', replace: '`src/features/todo-list/components/presenters/TodoInput.test.tsx`', with: 'next to the presenter' },
        {
          file: 'docs/architecture.md',
          replace: ' `src/features/todo-list/components/TodoListLayout.tsx` reads the todos and hands them to the presenters in `src/features/todo-list/components/presenters/`.',
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
        { file: 'oxlint.config.ts', replace: 'extends: [reactViteConfig]', with: 'extends: [reactViteConfig, tailwindConfig]' },
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
      when: { styling: 'css-modules' },
      overlay: 'css-modules',
      edits: [
        { file: 'package.json', replace: '"typecheck": "tsc -p', with: '"typecheck": "npm run css-types && tsc -p' },
        { file: 'package.json', after: '"typecheck": "npm run css-types && tsc -p tsconfig.app.json && tsc -p tsconfig.test.json",\n', insert: `    "css-types": "${CSS_MODULES_TYPES}",\n` },
        { file: 'package.json', replace: '"prepare": "git config core.hooksPath .githooks"', with: '"prepare": "git config core.hooksPath .githooks && npm run css-types"' },
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
      when: { example: false, e2e: true },
      remove: ['e2e/todos.spec.ts'],
      edits: [
        {
          file: 'docs/verifications.md',
          replace: ' `e2e/todos.spec.ts` covers the example: the same two checks while a task is being renamed, the counters while adding, checking, filtering and clearing tasks, and renaming.',
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
          replace: 'oxlint --type-aware src e2e oxlint.config.ts vite.config.ts vitest.config.ts playwright.config.ts',
          with: 'oxlint --type-aware src oxlint.config.ts vite.config.ts vitest.config.ts',
        },
        { file: 'tsconfig.test.json', replace: '"include": ["src", "e2e",', with: '"include": ["src",' },
        { file: 'tsconfig.test.json', replace: ', "playwright.config.ts"]', with: ']' },
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
      when: { styling: 'css-modules' },
      edits: [
        { file: 'tsconfig.app.json', replace: '"@/*": ["./src/*"]', with: '"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]' },
        { file: 'tsconfig.test.json', replace: '"@/*": ["./src/*"]', with: '"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]' },
      ],
    },
  ],
  nextSteps: (answers) => [...(answers['e2e'] || answers['component-tests'] ? ['npx playwright install --only-shell chromium'] : []), 'npm run dev'],
};
