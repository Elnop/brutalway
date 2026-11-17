import { PLAIN_LAYOUT } from '#src/features/stacks/configs/reactNativeChangesConfig.ts';
import type { StackChange } from '#src/shared/stack/StackTypes.ts';

const LAYOUT = 'src/app/_layout.tsx';

const PLAIN_STACK = '  return <Stack screenOptions={STACK_SCREEN_OPTIONS} />;';

const I18N_SETUP_LINE = 'gives the tests the same i18next instance as the app';

export const NATIVE_NO_I18N_LAYOUT: StackChange[] = [
  {
    when: { i18n: 'none' },
    edits: [
      { file: LAYOUT, dropLines: '@/features/i18n/I18nProvider.tsx' },
      { file: LAYOUT, replace: `  return (\n${PLAIN_LAYOUT}\n  );`, with: PLAIN_STACK },
    ],
  },
];

export const NATIVE_NO_I18N_SERVER_STATE: StackChange[] = [
  {
    when: { 'server-state': true, i18n: 'none' },
    edits: [
      {
        file: LAYOUT,
        after: "import { Stack } from 'expo-router';\n",
        insert: "import { QueryClientProvider } from '@tanstack/react-query';\n",
      },
      {
        file: LAYOUT,
        after: "import { STACK_SCREEN_OPTIONS } from '@/features/page-shell/StackConfig.ts';\n",
        insert: "import { queryClient } from '@/features/query-client/queryClient.ts';\n",
      },
      {
        file: LAYOUT,
        replace: PLAIN_STACK,
        with: '  return (\n    <QueryClientProvider client={queryClient}>\n      <Stack screenOptions={STACK_SCREEN_OPTIONS} />\n    </QueryClientProvider>\n  );',
      },
    ],
  },
];

const WITHOUT_JEST_SETUP: StackChange = {
  when: {},
  remove: ['jest.setup.ts'],
  edits: [
    {
      file: 'package.json',
      replace: '    "setupFiles": [\n      "<rootDir>/jest.setup.ts"\n    ],\n',
      with: '',
    },
    { file: 'package.json', replace: ' jest.setup.ts', with: '' },
    { file: 'tsconfig.test.json', dropLines: '"jest.setup.ts"' },
    { file: 'docs/reference/verifications.md', dropLines: I18N_SETUP_LINE },
  ],
};

export const NATIVE_NO_I18N: StackChange[] = [
  {
    when: { i18n: 'none' },
    edits: [
      { file: 'package.json', replace: ' && i18next-cli types --quiet"', with: '"' },
      {
        file: 'package.json',
        replace: '      "^@locales/(.*)$": "<rootDir>/locales/$1",\n',
        with: '',
      },
      { file: 'knip.json', replace: '"i18next.config.ts", ', with: '' },
      { file: 'tsconfig.json', replace: ',\n      "@locales/*": ["./locales/*"]', with: '' },
      {
        file: 'docs/reference/layout.md',
        replace: 'the routes, the i18n setup and the messages',
        with: 'the routes',
      },
      {
        file: 'docs/reference/layout.md',
        replace: '`_layout.tsx` loads the fonts and wraps every screen in the i18n provider,',
        with: '`_layout.tsx` loads the fonts,',
      },
      {
        file: 'docs/reference/layout.md',
        replace:
          ', so it holds nothing else: the i18n setup is the `src/features/i18n/` feature, and the messages are data, in `locales/` at the root of the project, imported through the `@locales/*` alias.',
        with: ', so it holds nothing else.',
      },
      {
        file: 'docs/reference/verifications.md',
        replace: ', then the i18next config.',
        with: '.',
      },
    ],
  },
  {
    when: { i18n: 'none', example: true, 'server-state': false },
    edits: [
      {
        file: 'jest.setup.ts',
        replace:
          "import { setI18n } from 'react-i18next';\nimport { createI18n } from '@/features/i18n/createI18n.ts';\n",
        with: '',
      },
      { file: 'jest.setup.ts', replace: ');\n\nsetI18n(createI18n());\n', with: ');\n' },
      {
        file: 'docs/reference/verifications.md',
        replace: `${I18N_SETUP_LINE}, so a presenter renders its English text, and swaps`,
        with: 'swaps',
      },
    ],
  },
  { ...WITHOUT_JEST_SETUP, when: { i18n: 'none', example: false } },
  { ...WITHOUT_JEST_SETUP, when: { i18n: 'none', example: true, 'server-state': true } },
];
