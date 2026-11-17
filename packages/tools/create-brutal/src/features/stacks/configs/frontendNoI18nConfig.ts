import type { StackChange } from '#src/shared/stack/StackTypes.ts';

const SRC_ALIAS =
  "{ find: /^@\\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) }";

const LOCALES_ALIAS =
  "{ find: /^@locales\\//u, replacement: fileURLToPath(new URL('./locales/', import.meta.url)) }";

export const FRONTEND_NO_I18N_LINT: StackChange[] = [
  {
    when: { i18n: 'none' },
    edits: [
      { file: 'oxlint.config.ts', dropLines: '@brutalway/oxlint-config-i18next' },
      { file: 'oxlint.config.ts', replace: ', i18nextConfig]', with: ']' },
    ],
    removeDependencies: ['@brutalway/oxlint-config-i18next'],
  },
];

export const FRONTEND_NO_I18N_LOOKS: StackChange[] = [
  { when: { i18n: 'none', example: true }, overlay: 'no-i18n' },
  { when: { i18n: 'none', example: false }, overlay: 'no-i18n-skeleton' },
  {
    when: { i18n: 'none', styling: 'css-modules', example: true },
    overlay: 'no-i18n-css-modules-example',
  },
  {
    when: { i18n: 'none', styling: 'css-modules', example: false },
    overlay: 'no-i18n-css-modules-skeleton',
  },
  {
    when: { i18n: 'none', styling: 'tailwind', example: true },
    overlay: 'no-i18n-tailwind-example',
  },
  {
    when: { i18n: 'none', styling: 'tailwind', example: false },
    overlay: 'no-i18n-tailwind-skeleton',
  },
  { when: { i18n: 'none', ui: 'shadcn', example: true }, overlay: 'no-i18n-shadcn-example' },
];

export const FRONTEND_NO_I18N_FORMS: StackChange[] = [
  {
    when: { i18n: 'none', forms: true, example: true },
    overlay: 'no-i18n-forms-example',
    edits: [
      {
        file: 'src/shared/todos/TodosConfig.ts',
        replace: "['blankTitle', 'longTitle']",
        with: "['The title is blank', 'The title is 200 characters at most']",
      },
    ],
  },
];

export const FRONTEND_NO_I18N: StackChange[] = [
  {
    when: { i18n: 'none' },
    remove: ['i18next.config.ts', 'locales', 'src/features/i18n', 'docs/guides/translations.md'],
    removeScripts: ['messages'],
    removeDependencies: ['i18next', 'react-i18next', 'i18next-cli'],
    keep: ['src/features'],
    edits: [
      { file: 'package.json', replace: 'i18next-cli types --quiet && ', with: '', all: true },
      { file: 'package.json', replace: ' && npm run messages', with: '' },
      { file: 'package.json', replace: ' i18next.config.ts', with: '', all: true },
      { file: '.alint.yml', replace: "'locales/', ", with: '' },
      { file: 'tsconfig.app.json', replace: ',\n      "@locales/*": ["./locales/*"]', with: '' },
      { file: 'tsconfig.app.json', replace: ', "node_modules/.cache/i18next"', with: '' },
      { file: 'tsconfig.test.json', replace: '      "@locales/*": ["./locales/*"],\n', with: '' },
      { file: 'tsconfig.test.json', dropLines: '"node_modules/.cache/i18next"' },
      { file: 'tsconfig.test.json', replace: ',\n    "i18next.config.ts"', with: '' },
      {
        file: 'AGENTS.md',
        replace: 'check-doc-links, i18next-cli, alint',
        with: 'check-doc-links, alint',
      },
      {
        file: 'AGENTS.md',
        replace:
          '- Every visible string goes through `t()`, with its English text in `locales/en/`.',
        with: '- Visible text is written in English, in the components.',
      },
      {
        file: 'docs/reference/commands.md',
        replace: 'check-doc-links, i18next-cli, alint',
        with: 'check-doc-links, alint',
      },
      { file: 'README.md', dropLines: '(docs/guides/translations.md)' },
      { file: 'docs/reference/verifications.md', dropLines: 'runs `i18next-cli types`' },
      {
        file: 'docs/reference/verifications.md',
        dropLines: 'The message only says "disallow literal string"',
      },
      { file: 'docs/reference/verifications.md', dropSection: '## Messages' },
    ],
  },
  {
    when: { i18n: 'none', styling: ['css', 'tailwind'] },
    edits: [{ file: 'package.json', replace: ' && i18next-cli types --quiet"', with: '"' }],
  },
  {
    when: { i18n: 'none', ui: 'none' },
    edits: [
      { file: 'knip.json', replace: '  "entry": ["i18next.config.ts"],\n', with: '' },
      {
        file: '{{aliasFile}}',
        replace: `    alias: [\n      ${SRC_ALIAS},\n      ${LOCALES_ALIAS},\n    ],`,
        with: `    alias: [${SRC_ALIAS}],`,
      },
    ],
  },
  {
    when: { i18n: 'none', ui: 'shadcn' },
    edits: [
      { file: 'knip.json', replace: '"i18next.config.ts", ', with: '' },
      { file: '{{aliasFile}}', replace: `      ${LOCALES_ALIAS},\n`, with: '' },
    ],
  },
  {
    when: { i18n: 'none', example: true },
    edits: [
      {
        file: 'docs/guides/start-your-own-app.md',
        replace:
          ', the `todoList` and `todoStats` namespaces (their JSON in `locales/en/` and their lines in `src/features/i18n/createI18n.ts`)',
        with: '',
      },
    ],
  },
];

export const WEB_NO_I18N: StackChange[] = [
  {
    when: { i18n: 'none' },
    remove: ['vitest.setup.ts'],
    edits: [
      { file: 'package.json', replace: ' vitest.setup.ts', with: '', all: true },
      { file: 'vitest.config.ts', dropLines: "setupFiles: ['vitest.setup.ts']" },
      { file: 'tsconfig.test.json', dropLines: '"vitest.setup.ts"' },
      {
        file: 'docs/reference/verifications.md',
        replace:
          ' `vitest.setup.ts` gives the tests the same i18next instance as the app, so a presenter renders its English text.',
        with: '',
      },
    ],
  },
];
