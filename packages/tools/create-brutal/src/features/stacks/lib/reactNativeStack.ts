import { PACKAGE_MANAGER_OPTION } from '#src/shared/stack/configs/PackageManagerConfig.ts';
import { NATIVE_NO_UNIT_TESTS } from '#src/features/stacks/configs/noUnitTestsConfig.ts';
import {
  FRONTEND_NO_I18N,
  FRONTEND_NO_I18N_FORMS,
  FRONTEND_NO_I18N_LINT,
  FRONTEND_NO_I18N_LOOKS,
} from '#src/features/stacks/configs/frontendNoI18nConfig.ts';
import {
  NATIVE_NO_I18N,
  NATIVE_NO_I18N_LAYOUT,
  NATIVE_NO_I18N_SERVER_STATE,
} from '#src/features/stacks/configs/nativeNoI18nConfig.ts';
import { sharedFolderDocs } from '#src/features/stacks/lib/sharedFolderDocs.ts';
import { frontendI18nLocales } from '#src/features/stacks/lib/frontendI18nLocales.ts';
import { i18nLocaleEdits } from '#src/features/stacks/lib/i18nLocaleEdits.ts';
import type { FileEdit, Stack, StackChange, StackOption } from '#src/shared/stack/StackTypes.ts';
import { normalizeTitleChanges } from '#src/features/stacks/lib/normalizeTitleChanges.ts';
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
  FORMS_SCHEMAS_IN_TITLE_FORM,
  FRONTEND_FORMS_EXAMPLE,
  FRONTEND_FORMS_SERVER_STATE,
  FRONTEND_I18N_FORMS,
  NATIVE_CREATE_I18N,
  FRONTEND_LOOK_OPTIONS,
  FRONTEND_NO_ZUSTAND,
  FRONTEND_SERVER_STATE,
  FRONTEND_SERVER_STATE_AGENTS,
  FRONTEND_SKELETON,
  FRONTEND_SKELETON_ZUSTAND,
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

const JEST_WITHOUT_TESTS: FileEdit = {
  file: 'package.json',
  replace: '"test": "jest",',
  with: '"test": "jest --passWithNoTests",',
};

function analyticsTrackerPath(file: string): FileEdit {
  return {
    file,
    replace: '`src/shared/analytics/analyticsTracker.ts`',
    with: '`src/features/analytics/analyticsTracker.ts`',
    all: true,
  };
}

const APP_OPENED: FileEdit[] = [
  {
    file: 'src/app/_layout.tsx',
    before: "import { STACK_SCREEN_OPTIONS } from '@/features/page-layout/StackConfig.ts';\n",
    insert: "import { useAppOpened } from '@/features/analytics/useAppOpened.ts';\n",
  },
  {
    file: 'src/app/_layout.tsx',
    after: 'export default function RootLayout() {\n',
    insert: '  useAppOpened();\n',
  },
];

const ANALYTICS_HOME = 'src/features/analytics';

const ANALYTICS_HOME_IMPORTS: FileEdit[] = [
  {
    file: `${ANALYTICS_HOME}/useAppOpened.ts`,
    replace: "'@/shared/analytics/analyticsTracker.ts'",
    with: "'@/features/analytics/analyticsTracker.ts'",
  },
  analyticsTrackerPath('README.md'),
];

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

const THEME_CONFIG = 'src/shared/theme/ThemeConfig.ts';
const PAGE_LAYOUT_CONFIGS = 'src/features/page-layout/configs';
const SWITCH_PRESENTERS = 'src/features/language-switch/components/presenters';
const SWITCH_PRESENTER_TESTS = 'test/unit/features/language-switch/components/presenters';
const THEME_SENTENCE =
  '`src/shared/theme/` holds the theme (`ThemeConfig.ts`) and the `Button` every feature uses.';

function importEdit(file: string, from: string, to: string): FileEdit {
  return {
    file,
    replace: `'${from.replace(/^src\//u, '@/')}'`,
    with: `'${to.replace(/^src\//u, '@/')}'`,
  };
}

function docPathEdits(files: string[], from: string, to: string): FileEdit[] {
  return files.map((file) => ({ file, replace: `\`${from}\``, with: `\`${to}\``, all: true }));
}

const THEME_SKELETON_CHANGES: StackChange[] = [
  {
    when: { example: false, i18n: ['none', 'en'] },
    move: {
      [THEME_CONFIG]: `${PAGE_LAYOUT_CONFIGS}/ThemeConfig.ts`,
      'src/features/page-layout/StackConfig.ts': `${PAGE_LAYOUT_CONFIGS}/StackConfig.ts`,
    },
    edits: [
      importEdit(
        'src/features/page-layout/PageLayout.tsx',
        THEME_CONFIG,
        `${PAGE_LAYOUT_CONFIGS}/ThemeConfig.ts`,
      ),
      importEdit(
        `${PAGE_LAYOUT_CONFIGS}/StackConfig.ts`,
        THEME_CONFIG,
        `${PAGE_LAYOUT_CONFIGS}/ThemeConfig.ts`,
      ),
      importEdit(
        'src/app/_layout.tsx',
        'src/features/page-layout/StackConfig.ts',
        `${PAGE_LAYOUT_CONFIGS}/StackConfig.ts`,
      ),
      ...docPathEdits(
        [
          'README.md',
          'AGENTS.md',
          'docs/concepts/architecture.md',
          'docs/reference/verifications.md',
        ],
        THEME_CONFIG,
        `${PAGE_LAYOUT_CONFIGS}/ThemeConfig.ts`,
      ),
      {
        file: 'docs/reference/layout.md',
        replace: THEME_SENTENCE,
        with: `The theme sits in \`${PAGE_LAYOUT_CONFIGS}/ThemeConfig.ts\`, next to the page frame, its only user.`,
      },
    ],
  },
  {
    when: { example: false, i18n: 'en-fr' },
    move: {
      'src/shared/theme/Button.tsx': `${SWITCH_PRESENTERS}/Button.tsx`,
      'src/shared/theme/ThemeTypes.ts': 'src/features/language-switch/ThemeTypes.ts',
      'src/features/language-switch/components/LanguageSwitch.tsx': `${SWITCH_PRESENTERS}/LanguageSwitch.tsx`,
    },
    edits: [
      importEdit(
        'src/features/language-switch/components/LanguageSwitchContainer.tsx',
        'src/features/language-switch/components/LanguageSwitch.tsx',
        `${SWITCH_PRESENTERS}/LanguageSwitch.tsx`,
      ),
      importEdit(
        `${SWITCH_PRESENTERS}/LanguageSwitch.tsx`,
        'src/shared/theme/Button.tsx',
        `${SWITCH_PRESENTERS}/Button.tsx`,
      ),
      importEdit(
        `${SWITCH_PRESENTERS}/Button.tsx`,
        'src/shared/theme/ThemeTypes.ts',
        'src/features/language-switch/ThemeTypes.ts',
      ),
      ...docPathEdits(
        ['docs/concepts/architecture.md', 'docs/reference/verifications.md'],
        'src/shared/theme/Button.tsx',
        `${SWITCH_PRESENTERS}/Button.tsx`,
      ),
      {
        file: 'docs/reference/layout.md',
        replace: THEME_SENTENCE,
        with: `\`src/shared/theme/\` holds the theme (\`ThemeConfig.ts\`). The \`Button\` of the series sits in \`${SWITCH_PRESENTERS}/Button.tsx\`, next to the language switch, its only user.`,
      },
    ],
  },
  {
    when: { example: false, i18n: 'en-fr', 'component-tests': true },
    edits: [
      importEdit(
        `${SWITCH_PRESENTER_TESTS}/Button.test.tsx`,
        'src/shared/theme/Button.tsx',
        `${SWITCH_PRESENTERS}/Button.tsx`,
      ),
      importEdit(
        `${SWITCH_PRESENTER_TESTS}/LanguageSwitch.test.tsx`,
        'src/features/language-switch/components/LanguageSwitch.tsx',
        `${SWITCH_PRESENTERS}/LanguageSwitch.tsx`,
      ),
    ],
  },
];

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
    { id: 'unit-tests', message: 'Add unit tests (Jest)?', default: true },
    {
      id: 'component-tests',
      message: 'Add component tests (React Native Testing Library)?',
      default: true,
      requires: { 'unit-tests': true },
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
    PACKAGE_MANAGER_OPTION,
  ],
  changes: fillAnchors(
    [
      ...FRONTEND_BASE,
      ...FRONTEND_NO_I18N_LINT,
      ...NATIVE_NO_I18N_LAYOUT,
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
      ...FRONTEND_NO_I18N_LOOKS,
      {
        when: { example: false },
        edits: [{ file: 'docs/concepts/architecture.md', replace: PERSISTENCE_DOC, with: '' }],
        removeDependencies: ['expo-crypto'],
      },
      {
        when: { example: false, i18n: ['none', 'en'] },
        edits: WITHOUT_ASYNC_STORAGE,
        removeDependencies: ['@react-native-async-storage/async-storage'],
      },
      {
        when: { example: false, 'component-tests': false },
        edits: [JEST_WITHOUT_TESTS],
      },
      {
        when: { example: false, i18n: ['none', 'en'], 'component-tests': true },
        remove: ['test/unit/shared/theme/Button.test.tsx'],
      },
      {
        when: { example: false, i18n: ['none', 'en'] },
        remove: ['src/shared/theme/Button.tsx', 'src/shared/theme/ThemeTypes.ts'],
        edits: [
          {
            file: 'docs/concepts/architecture.md',
            replace:
              ' The pressable look of the series (border, hard shadow, the press that moves the button onto its shadow) is written once, in `src/shared/theme/Button.tsx`.',
            with: '',
          },
          {
            file: 'docs/reference/verifications.md',
            dropLines: '`no-unused-styles` only sees a style read as',
          },
        ],
      },
      {
        when: { example: false, i18n: ['none', 'en'] },
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
            file: 'src/shared/theme/ThemeConfig.ts',
            replace: 'const COLORS = {',
            with: "import { Appearance } from 'react-native';\n\nconst LIGHT = {",
          },
          {
            file: 'src/shared/theme/ThemeConfig.ts',
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
              '- Colors follow the theme of the system: a color token gets its dark value in the `DARK` set of `src/shared/theme/ThemeConfig.ts`, never in a component.\n',
          },
        ],
        addDependencies: { 'expo-system-ui': '58.0.7' },
      },
      ...FRONTEND_SERVER_STATE,
      ...NATIVE_NO_I18N_SERVER_STATE,
      {
        when: { 'server-state': true, i18n: ['en', 'en-fr'] },
        edits: [
          {
            file: 'src/app/_layout.tsx',
            after:
              "import { STACK_SCREEN_OPTIONS } from '@/features/page-layout/StackConfig.ts';\n",
            insert: "import { QueryProvider } from '@/features/query-client/QueryProvider.tsx';\n",
          },
          { file: 'src/app/_layout.tsx', replace: PLAIN_LAYOUT, with: SERVER_STATE_LAYOUT },
        ],
      },
      {
        when: { 'server-state': true, example: true },
        overlay: 'server-state-example',
        remove: [
          'src/shared/todos/useTodos.ts',
          'src/shared/todos/todosStore.ts',
          'src/shared/todos/lib/todosStorage.ts',
          'src/shared/todos/lib/todosSelectors.ts',
        ],
        edits: [
          { file: 'docs/concepts/architecture.md', replace: PERSISTENCE_DOC, with: '' },
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
        removeDependencies: ['expo-crypto'],
        addDependencies: { zod: '4.6.7' },
      },
      {
        when: { 'server-state': true, example: true, i18n: ['none', 'en'] },
        edits: WITHOUT_ASYNC_STORAGE,
        removeDependencies: ['@react-native-async-storage/async-storage'],
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
      {
        when: { i18n: 'en-fr' },
        overlay: 'i18n',
        edits: [
          ...i18nLocaleEdits(NATIVE_CREATE_I18N),
          {
            file: 'src/app/index.tsx',
            before: "import { PageLayout } from '@/features/page-layout/PageLayout.tsx';\n",
            insert:
              "import { LanguageSwitchContainer } from '@/features/language-switch/components/LanguageSwitchContainer.tsx';\n",
          },
          {
            file: 'src/app/index.tsx',
            replace: "<PageLayout title={t('title')}",
            with: "<PageLayout actions={<LanguageSwitchContainer />} title={t('title')}",
          },
          {
            file: 'docs/guides/translations.md',
            replace:
              '## Add a language\n\nTo add a language, add a `locales/<language>/` folder next to each `locales/en/`, import its files in `src/createI18n.ts` and list it under `locales` in `i18next.config.ts`.',
            with: I18N_README,
          },
        ],
        addDependencies: { 'expo-localization': '58.0.5' },
      },
      ...frontendI18nLocales(NATIVE_CREATE_I18N),
      ...FRONTEND_I18N_FORMS,
      {
        when: { i18n: 'en-fr', 'component-tests': true },
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
        remove: ['test/unit/**/*.test.tsx'],
      },
      {
        when: { 'component-tests': false, example: false },
        remove: ['test/unit/**/*.test.tsx'],
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
          { file: 'package.json', replace: '"test": "jest', with: '"test": "jest --coverage' },
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
            replace: 'oxlint --type-aware src test scripts ',
            with: 'oxlint --type-aware src test ',
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
          'posthog-react-native': '4.87.3',
          'expo-application': '58.1.2',
          'expo-device': '58.0.5',
          'expo-file-system': '58.0.14',
          'expo-localization': '58.0.5',
        },
      },
      ...FRONTEND_ANALYTICS_AND_AGENTS,
      { when: { analytics: 'module' }, edits: APP_OPENED, overlay: 'analytics-app-opened' },
      { when: { analytics: 'posthog' }, edits: APP_OPENED, overlay: 'analytics-app-opened' },
      {
        when: { analytics: 'module', example: false },
        move: {
          'src/shared/analytics/analyticsTracker.ts': `${ANALYTICS_HOME}/analyticsTracker.ts`,
        },
        edits: ANALYTICS_HOME_IMPORTS,
      },
      {
        when: { analytics: 'posthog', example: false },
        move: {
          'src/shared/analytics/analyticsTracker.ts': `${ANALYTICS_HOME}/analyticsTracker.ts`,
          'src/shared/analytics/AnalyticsTypes.ts': `${ANALYTICS_HOME}/AnalyticsTypes.ts`,
        },
        edits: [
          ...ANALYTICS_HOME_IMPORTS,
          {
            file: `${ANALYTICS_HOME}/analyticsTracker.ts`,
            replace: "'@/shared/analytics/AnalyticsTypes.ts'",
            with: "'@/features/analytics/AnalyticsTypes.ts'",
          },
        ],
      },
      ...FRONTEND_SERVER_STATE_AGENTS,
      ...FRONTEND_AGENTS,
      { when: { analytics: 'module', example: false }, edits: [analyticsTrackerPath('AGENTS.md')] },
      {
        when: { analytics: 'posthog', example: false },
        edits: [analyticsTrackerPath('AGENTS.md')],
      },
      ...THEME_SKELETON_CHANGES,
      ...FRONTEND_NO_I18N,
      ...NATIVE_NO_I18N,
      sharedFolderDocs(
        ['AGENTS.md', 'docs/reference/layout.md', 'docs/reference/verifications.md'],
        {
          example: false,
          i18n: ['none', 'en'],
        },
      ),
      ...NATIVE_NO_UNIT_TESTS,
    ],
    ANCHORS,
  ),
  nextSteps: (answers) => [answers['expo-go'] === true ? 'npm start' : 'npm run android'],
};
