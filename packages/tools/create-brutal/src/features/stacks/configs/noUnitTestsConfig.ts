import type { FileEdit, StackChange } from '#src/shared/stack/StackTypes.ts';

const UNIT_TESTS_OFF = { 'unit-tests': false };

const TEST_DOCS: FileEdit[] = [
  { file: 'AGENTS.md', dropLines: '- A unit test sits in `test/unit/`' },
  { file: 'docs/reference/commands.md', dropLines: '| `npm test` |' },
];

const CI_STEP_WITHOUT_TESTS: FileEdit = {
  file: '.github/workflows/ci.yml',
  dropLines: '      - run: npm test',
};

const CI_WITHOUT_TESTS: StackChange = {
  when: { ...UNIT_TESTS_OFF, ci: true },
  edits: [
    CI_STEP_WITHOUT_TESTS,
    { file: 'docs/reference/commands.md', replace: 'runs `check`, `test`', with: 'runs `check`' },
  ],
};

const AGENTS_WITHOUT_NPM_TEST: FileEdit = {
  file: 'AGENTS.md',
  replace: ' Then run `npm test`.',
  with: '',
};

const COMPILER_WITHOUT_VITEST: StackChange = {
  when: { ...UNIT_TESTS_OFF, 'react-compiler': true },
  edits: [
    {
      file: 'docs/reference/verifications.md',
      replace:
        ' Vitest runs without it, since its memo caches add branches the tests would have to reach: unit and component tests check the code as written, and the e2e tests run the compiled build.',
      with: '',
    },
  ],
};

export const FRONTEND_NO_UNIT_TESTS: StackChange[] = [
  {
    when: UNIT_TESTS_OFF,
    remove: ['vitest.config.ts'],
    discard: ['test/unit', 'test/support'],
    edits: [
      ...TEST_DOCS,
      { file: 'package.json', replace: ' vitest.config.ts', with: '' },
      { file: 'tsconfig.test.json', dropLines: '"vitest.config.ts"' },
      { file: 'docs/reference/verifications.md', dropLines: '| Unit |' },
    ],
    removeScripts: ['test', 'test:unit', 'test:watch'],
    removeDependencies: ['vitest'],
  },
  {
    when: { ...UNIT_TESTS_OFF, i18n: ['en', 'en-fr'] },
    remove: ['vitest.setup.ts'],
    edits: [
      { file: 'package.json', replace: ' vitest.setup.ts', with: '' },
      { file: 'tsconfig.test.json', dropLines: '"vitest.setup.ts"' },
      {
        file: 'docs/reference/verifications.md',
        replace:
          ' `vitest.setup.ts` gives the tests the same i18next instance as the app, so a presenter renders its English text.',
        with: '',
      },
    ],
  },
  {
    when: { ...UNIT_TESTS_OFF, e2e: true },
    edits: [
      {
        file: 'AGENTS.md',
        replace: 'Then run `npm test`, and `npm run e2e` when',
        with: 'Then run `npm run e2e` when',
      },
    ],
  },
  {
    when: { ...UNIT_TESTS_OFF, e2e: false },
    edits: [
      AGENTS_WITHOUT_NPM_TEST,
      { file: 'docs/reference/verifications.md', dropSection: '## Tests' },
    ],
  },
  CI_WITHOUT_TESTS,
  COMPILER_WITHOUT_VITEST,
];

export const NATIVE_NO_UNIT_TESTS: StackChange[] = [
  {
    when: UNIT_TESTS_OFF,
    discard: ['test', 'jest.setup.ts'],
    edits: [
      ...TEST_DOCS,
      AGENTS_WITHOUT_NPM_TEST,
      { file: 'package.json', replace: ' jest.setup.ts', with: '' },
      {
        file: 'tsconfig.test.json',
        replace: '"types": ["expo/types", "node", "jest"]',
        with: '"types": ["expo/types", "node"]',
      },
      { file: 'docs/reference/verifications.md', dropSection: '## Tests' },
    ],
    removeScripts: ['test', 'test:watch'],
    removePackageFields: ['jest'],
    removeDependencies: ['jest', 'jest-expo', '@types/jest', '@jest/globals'],
  },
  CI_WITHOUT_TESTS,
];

export const SERVER_NO_UNIT_TESTS: StackChange[] = [
  {
    when: UNIT_TESTS_OFF,
    discard: ['test'],
    edits: [
      ...TEST_DOCS,
      AGENTS_WITHOUT_NPM_TEST,
      {
        file: 'oxlint.config.ts',
        replace: "import { nodeTestConfig } from '@brutalway/oxlint-config-node-test';\n",
        with: '',
      },
      { file: 'oxlint.config.ts', replace: ', nodeTestConfig]', with: ']' },
      { file: 'docs/reference/verifications.md', dropSection: '## Tests' },
    ],
    removeScripts: ['test'],
    removeDependencies: ['@brutalway/oxlint-config-node-test'],
  },
  { when: { ...UNIT_TESTS_OFF, ci: true }, edits: [CI_STEP_WITHOUT_TESTS] },
];

export const NEXT_NO_UNIT_TESTS: StackChange[] = [
  { when: UNIT_TESTS_OFF, removeDependencies: ['@vitejs/plugin-react', 'vite'] },
  {
    when: { ...UNIT_TESTS_OFF, 'react-compiler': true },
    edits: [{ file: 'knip.json', replace: '\n    "babel-plugin-react-compiler",', with: '' }],
  },
];
