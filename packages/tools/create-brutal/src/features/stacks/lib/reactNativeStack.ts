import type { Stack, StackOption } from '#src/shared-features/stack/StackTypes.ts';
import { fillAnchors } from '#src/features/stacks/lib/fillAnchors.ts';
import {
  FRONTEND_AGENTS,
  FRONTEND_ANALYTICS_AND_AGENTS,
  FRONTEND_BASE,
  FRONTEND_COMPILER,
  FRONTEND_COMPILER_EXAMPLE,
  FRONTEND_E2E_AND_REPOSITORY,
  FRONTEND_FEATURE_OPTIONS,
  FRONTEND_FORMS,
  FRONTEND_FORMS_EXAMPLE,
  FRONTEND_FORMS_SERVER_STATE,
  FRONTEND_I18N_FORMS,
  FRONTEND_I18N_LOCALES,
  FRONTEND_LOOK_OPTIONS,
  FRONTEND_NO_ZUSTAND,
  FRONTEND_SERVER_STATE,
  FRONTEND_SERVER_STATE_AGENTS,
  FRONTEND_SKELETON,
  FRONTEND_SKELETON_ZUSTAND,
  I18N_LOCALE_EDITS,
  PRESENTER_TEST_EXAMPLE,
} from '#src/features/stacks/configs/frontendChangesConfig.ts';
import {
  ANALYTICS_MODULE_README,
  ANALYTICS_POSTHOG_README,
  COVERAGE_DOC,
  COVERAGE_JEST,
  DARK_COLORS,
  DARK_THEME_README,
  DEV_BUILD_COMMANDS,
  DEV_BUILD_README,
  EXPO_GO_COMMANDS,
  EXPO_GO_README,
  I18N_README,
  PERSISTENCE_DOC,
  PLAIN_LAYOUT,
  REACT_COMPILER_DOC,
  SERVER_STATE_LAYOUT,
  SERVER_STATE_README,
  TESTS_PARAGRAPH,
  WITHOUT_ASYNC_STORAGE,
} from '#src/features/stacks/configs/reactNativeChangesConfig.ts';

const ANCHORS = {
  template: 'react-native',
  preset: 'reactNativeConfig',
  presetImport: "import { reactNativeConfig } from '@brutalway/oxlint-config-react-native';",
  testsLintLine:
    '- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, `toBe` for primitives',
};

const SHARED_OPTION_IDS = new Set([
  'example',
  'zustand',
  'dark-theme',
  'forms',
  'i18n',
  'react-compiler',
  'analytics',
  'coverage',
  'claude-hook',
  'ci',
]);

const SHARED_OPTIONS = [...FRONTEND_LOOK_OPTIONS, ...FRONTEND_FEATURE_OPTIONS].filter((option) =>
  SHARED_OPTION_IDS.has(option.id),
);

function sharedOption(id: string): StackOption {
  const option = SHARED_OPTIONS.find((candidate) => candidate.id === id);
  if (option === undefined) throw new Error(`no shared option ${id}`);
  return option;
}

const COMPONENT_TESTS_COMMAND =
  'Jest with the `jest-expo` preset: unit tests and component tests, all in Node';

export const reactNativeStack: Stack = {
  id: 'react-native',
  label: 'React Native + Expo',
  directory: 'templates/react-native',
  options: [
    sharedOption('example'),
    sharedOption('zustand'),
    sharedOption('dark-theme'),
    {
      id: 'server-state',
      message: 'Read and write the data through an API with TanStack Query?',
      default: false,
    },
    sharedOption('forms'),
    sharedOption('i18n'),
    sharedOption('react-compiler'),
    sharedOption('analytics'),
    {
      id: 'component-tests',
      message: 'Add component tests (React Native Testing Library)?',
      default: true,
    },
    sharedOption('coverage'),
    {
      id: 'expo-go',
      message: 'Run the app in Expo Go instead of a development build?',
      default: false,
      independent: true,
    },
    sharedOption('claude-hook'),
    sharedOption('ci'),
  ],
  changes: fillAnchors(
    [
      ...FRONTEND_BASE,
      {
        when: {},
        edits: [
          {
            file: 'app.json',
            replace: 'template-react-native',
            with: '__PROJECT_NAME__',
            all: true,
          },
          {
            file: 'app.json',
            replace: 'com.example.templatereactnative',
            with: 'com.example.__PROJECT_ID__',
            all: true,
          },
        ],
      },
      ...FRONTEND_SKELETON,
      {
        when: { example: false },
        edits: [{ file: 'docs/concepts/architecture.md', replace: PERSISTENCE_DOC, with: '' }],
        removeDependencies: ['expo-crypto'],
      },
      {
        when: { example: false, i18n: false },
        edits: WITHOUT_ASYNC_STORAGE,
        removeDependencies: ['@react-native-async-storage/async-storage'],
      },
      {
        when: { example: false, 'component-tests': false },
        edits: [
          {
            file: 'package.json',
            replace: '"test": "jest",',
            with: '"test": "jest --passWithNoTests",',
          },
        ],
      },
      {
        when: { example: false },
        edits: [
          {
            file: 'knip.json',
            replace: '"src/app/screens/**/*.tsx!"',
            with: '"src/app/screens/**/*.tsx!", "src/shared-features/theme/Button.tsx!"',
          },
        ],
      },
      {
        when: { example: false, 'component-tests': false, i18n: false },
        edits: [
          {
            file: 'knip.json',
            replace: '"ignoreDependencies": [\n    "@swc/core",\n',
            with: '"ignoreDependencies": [\n    "@swc/core",\n    "@jest/globals",\n',
          },
        ],
      },
      {
        when: { 'dark-theme': true },
        edits: [
          {
            file: 'src/shared-features/theme/ThemeConfig.ts',
            replace: 'const COLORS = {',
            with: "import { Appearance } from 'react-native';\n\nconst LIGHT = {",
          },
          {
            file: 'src/shared-features/theme/ThemeConfig.ts',
            replace: '} as const;\n\nexport const THEME',
            with: `} as const;\n\n${DARK_COLORS}export const THEME`,
          },
          {
            file: 'app.json',
            after: '"orientation": "portrait",\n',
            insert: '    "userInterfaceStyle": "automatic",\n',
          },
          { file: 'README.md', before: 'Part of [brutalway]', insert: DARK_THEME_README },
          {
            file: 'AGENTS.md',
            before: '- No comments,',
            insert:
              '- Colors follow the theme of the system: a color token gets its dark value in the `DARK` set of `src/shared-features/theme/ThemeConfig.ts`, never in a component.\n',
          },
        ],
        addDependencies: { 'expo-system-ui': '58.0.7' },
      },
      ...FRONTEND_SERVER_STATE,
      {
        when: { 'server-state': true },
        edits: [
          {
            file: 'src/app/screens/_layout.tsx',
            after: "import { Stack } from 'expo-router';\n",
            insert: "import { QueryClientProvider } from '@tanstack/react-query';\n",
          },
          {
            file: 'src/app/screens/_layout.tsx',
            after: "import { I18nProvider } from '@/app/I18nProvider.tsx';\n",
            insert: "import { queryClient } from '@/app/queryClient.ts';\n",
          },
          { file: 'src/app/screens/_layout.tsx', replace: PLAIN_LAYOUT, with: SERVER_STATE_LAYOUT },
        ],
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
          { file: 'docs/concepts/architecture.md', replace: PERSISTENCE_DOC, with: '' },
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
        removeDependencies: ['expo-crypto'],
        addDependencies: { zod: '4.6.7' },
      },
      {
        when: { 'server-state': true, example: true, i18n: false },
        edits: WITHOUT_ASYNC_STORAGE,
        removeDependencies: ['@react-native-async-storage/async-storage'],
      },
      ...FRONTEND_FORMS,
      ...FRONTEND_FORMS_EXAMPLE,
      {
        when: { forms: true, example: true, 'server-state': false },
        overlay: 'forms-schemas',
      },
      ...FRONTEND_FORMS_SERVER_STATE,
      {
        when: { i18n: true },
        overlay: 'i18n',
        edits: [
          ...I18N_LOCALE_EDITS,
          {
            file: 'src/app/screens/index.tsx',
            after: "import { SafeAreaView } from 'react-native-safe-area-context';\n",
            insert:
              "import { LanguageSwitchContainer } from '@/features/language-switch/components/LanguageSwitchContainer.tsx';\n",
          },
          {
            file: 'src/app/screens/index.tsx',
            before: '        </View>\n        <View role="main"',
            insert: '          <LanguageSwitchContainer />\n',
          },
          {
            file: 'docs/guides/translations.md',
            replace:
              '## Add a language\n\nTo add a language, add its folder next to `src/app/locales/en/`, import its files in `src/app/createI18n.ts` and list it under `locales` in `i18next.config.ts`.',
            with: I18N_README,
          },
        ],
        addDependencies: { 'expo-localization': '58.0.5' },
      },
      ...FRONTEND_I18N_LOCALES,
      ...FRONTEND_I18N_FORMS,
      {
        when: { i18n: true, 'component-tests': true },
        overlay: 'i18n-component-tests',
      },
      {
        when: { example: false, 'component-tests': true },
        edits: [PRESENTER_TEST_EXAMPLE],
      },
      ...FRONTEND_SKELETON_ZUSTAND,
      ...FRONTEND_NO_ZUSTAND,
      {
        when: { 'component-tests': false, example: true },
        remove: ['src/**/*.test.tsx'],
      },
      {
        when: { 'component-tests': false, example: false },
        remove: ['src/shared-features/theme/Button.test.tsx'],
      },
      {
        when: { 'component-tests': false },
        edits: [
          {
            file: 'docs/reference/commands.md',
            replace: COMPONENT_TESTS_COMMAND,
            with: 'Jest with the `jest-expo` preset: unit tests, in Node',
          },
          { file: 'docs/reference/verifications.md', dropLines: '| Component |' },
          PRESENTER_TEST_EXAMPLE,
          {
            file: 'docs/reference/verifications.md',
            replace: TESTS_PARAGRAPH,
            with: '`npm test` runs them with Jest and the `jest-expo` preset, which mocks the native side of React Native: Vitest does not run React Native yet. ',
          },
        ],
        removeDependencies: ['@testing-library/react-native'],
      },
      {
        when: { coverage: true },
        edits: [
          {
            file: 'package.json',
            after: '    "preset": "jest-expo",\n',
            insert: COVERAGE_JEST,
          },
          { file: 'package.json', replace: '"test": "jest",', with: '"test": "jest --coverage",' },
          { file: '.gitignore', after: '.expo\n', insert: 'coverage\n' },
          { file: '.prettierignore', after: '.expo\n', insert: 'coverage\n' },
          {
            file: 'docs/reference/verifications.md',
            before: 'Before keeping a test,',
            insert: COVERAGE_DOC,
          },
          {
            file: 'docs/reference/commands.md',
            replace: COMPONENT_TESTS_COMMAND,
            with: `${COMPONENT_TESTS_COMMAND}, 90 % coverage`,
          },
        ],
      },
      {
        when: { 'expo-go': true },
        overlay: 'expo-go',
        remove: ['scripts', 'eas.json'],
        edits: [
          { file: 'package.json', dropLines: '"start:go":' },
          { file: 'package.json', dropLines: '"phone":' },
          {
            file: 'package.json',
            replace: '"android": "expo run:android",',
            with: '"android": "expo start --android",',
          },
          {
            file: 'package.json',
            replace: '"ios": "expo run:ios",',
            with: '"ios": "expo start --ios",',
          },
          {
            file: 'package.json',
            replace: 'oxlint --type-aware src test-utils scripts ',
            with: 'oxlint --type-aware src test-utils ',
          },
          { file: 'tsconfig.test.json', replace: '    "scripts",\n', with: '' },
          { file: 'knip.json', replace: ', "scripts/*.ts"]', with: ']' },
          { file: 'knip.json', replace: ',\n  "ignoreBinaries": ["wslpath"]\n', with: '\n' },
          { file: 'README.md', replace: 'npm run android\n```', with: 'npm start\n```' },
          { file: 'README.md', replace: DEV_BUILD_README, with: EXPO_GO_README },
          {
            file: 'README.md',
            replace: 'the development build on Android and iOS, a USB phone from WSL2, Expo Go',
            with: 'Expo Go, and when to move to a development build',
          },
          {
            file: 'docs/reference/commands.md',
            replace: DEV_BUILD_COMMANDS,
            with: EXPO_GO_COMMANDS,
          },
          {
            file: 'docs/reference/commands.md',
            replace:
              ' It builds no native app: `npm run android` and `npm run ios` build locally, and `eas.json` holds the profiles of [EAS Build](https://docs.expo.dev/build/introduction/).',
            with: ' It builds no native app.',
          },
          {
            file: 'docs/reference/verifications.md',
            replace:
              'Root config files and `scripts/` are the only exceptions. `scripts/` runs in Node on your machine, so it may also print to the console and call `fetch`',
            with: 'Root config files are the only exception',
          },
        ],
        removeDependencies: ['expo-dev-client'],
      },
      ...FRONTEND_E2E_AND_REPOSITORY,
      ...FRONTEND_COMPILER,
      {
        when: { 'react-compiler': true },
        edits: [
          {
            file: 'app.json',
            after: '"orientation": "portrait",\n',
            insert: '    "experiments": { "reactCompiler": true },\n',
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
      ...FRONTEND_COMPILER_EXAMPLE,
      {
        when: { analytics: 'module' },
        overlay: 'analytics-module',
        edits: [{ file: 'README.md', before: '## Documentation', insert: ANALYTICS_MODULE_README }],
      },
      {
        when: { analytics: 'posthog' },
        overlay: 'analytics-posthog',
        edits: [
          { file: 'README.md', before: '## Documentation', insert: ANALYTICS_POSTHOG_README },
        ],
        addDependencies: {
          'posthog-react-native': '4.86.0',
          'expo-application': '58.1.2',
          'expo-device': '58.0.5',
          'expo-file-system': '58.0.13',
          'expo-localization': '58.0.5',
        },
      },
      ...FRONTEND_ANALYTICS_AND_AGENTS,
      ...FRONTEND_SERVER_STATE_AGENTS,
      ...FRONTEND_AGENTS,
    ],
    ANCHORS,
  ),
  nextSteps: (answers) => [answers['expo-go'] === true ? 'npm start' : 'npm run android'],
};
