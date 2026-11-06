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

const CHROMIUM_DOC = 'Component tests and e2e need headless Chromium: `npx playwright install --only-shell chromium`.';

export const viteStack: Stack = {
  id: 'vite',
  label: 'Vite + React',
  repository: 'Elnop/template-vite',
  submodule: 'templates/vite',
  options: [
    { id: 'example', message: 'Keep the todo list example?', default: true, requires: { zustand: true } },
    { id: 'zustand', message: 'Add zustand for state?', default: true },
    { id: 'component-tests', message: 'Add component tests (Vitest in Chromium)?', default: true },
    { id: 'e2e', message: 'Add e2e tests (Playwright)?', default: true },
    { id: 'claude-hook', message: 'Add the Claude Code hook that lints each edited file?', default: true, independent: true },
    { id: 'ci', message: 'Add the GitHub Actions workflow?', default: true },
  ],
  changes: [
    {
      when: {},
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
      dependencies: ['zustand'],
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
      scripts: ['test:component'],
      dependencies: ['@vitest/browser-playwright', 'vitest-browser-react'],
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
      scripts: ['e2e'],
      dependencies: ['@playwright/test', '@axe-core/playwright', '@brutalway/playwright-fixtures'],
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
      devDependencies: { playwright: '1.64.1' },
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
      dependencies: ['@brutalway/agent-hook'],
    },
    {
      when: { ci: false },
      remove: ['.github'],
      edits: [
        { file: 'README.md', dropLines: 'CI (`.github/workflows/ci.yml`)' },
        { file: 'docs/verifications.md', replace: 'runs locally, in the pre-commit hook and in CI.', with: 'runs locally and in the pre-commit hook.' },
      ],
    },
  ],
  nextSteps: (answers) => [...(answers['e2e'] || answers['component-tests'] ? ['npx playwright install --only-shell chromium'] : []), 'npm run dev'],
};
