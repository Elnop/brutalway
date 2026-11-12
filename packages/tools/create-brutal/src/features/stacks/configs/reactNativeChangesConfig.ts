import type { FileEdit } from '#src/shared-features/stack/StackTypes.ts';

export const PERSISTENCE_DOC =
  'The todos are kept on the device through the `persist` middleware of zustand, on [AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/), which falls back to `localStorage` on the web build. The filter is left out of what is saved.\n\n';

const ASYNC_STORAGE_MOCK = `jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

`;

export const WITHOUT_ASYNC_STORAGE: FileEdit[] = [
  { file: 'jest.setup.ts', replace: ASYNC_STORAGE_MOCK, with: '' },
  { file: 'jest.setup.ts', replace: "import { jest } from '@jest/globals';\n", with: '' },
  {
    file: 'docs/reference/verifications.md',
    replace: ', and swaps AsyncStorage for its in-memory mock.',
    with: '.',
  },
];

export const SERVER_STATE_LAYOUT = `    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: THEME.colors.page },
          }}
        />
      </QueryClientProvider>
    </I18nProvider>`;

export const PLAIN_LAYOUT = `    <I18nProvider>
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.colors.page } }}
      />
    </I18nProvider>`;

export const SERVER_STATE_README = `## API

The todos come from an API. \`src/shared-features/todos/todosClient.ts\` calls \`/todos\` and \`/stats\` on \`EXPO_PUBLIC_API_URL\`, \`http://localhost:3000\` when it is not set, and parses each response with \`src/shared-features/todos/TodosSchemas.ts\`. The query hooks in \`src/shared-features/todos/hooks/\` cache the answers, and each change invalidates them through \`src/shared-features/todos/todosKeys.ts\`.

[template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify) serves these routes: start it, then the app. On an Android emulator or a USB phone, \`adb reverse tcp:3000 tcp:3000\` makes \`localhost:3000\` reach your machine. Elsewhere, set \`EXPO_PUBLIC_API_URL\` in \`.env.local\` to the address of your machine on the network. Expo writes the value into the bundle when Metro starts, so restart it after a change.

`;

export const I18N_README = `The example comes in English and French. The buttons under the title switch between them through \`src/features/language-switch/components/LanguageSwitchContainer.tsx\`, and the languages are listed in \`src/features/language-switch/LanguagesConfig.ts\`. At start, \`src/app/I18nProvider.tsx\` takes the language saved in AsyncStorage through \`src/features/language-switch/lib/languageStorage.ts\`, or else the first language of the device that the project has ([expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/)), and saves each change.

## Add a language

To add a language, add it to \`src/features/language-switch/LanguagesConfig.ts\`, add its folder next to \`src/app/locales/en/\`, import its files in \`src/app/createI18n.ts\` and list it under \`locales\` in \`i18next.config.ts\`.`;

export const DARK_COLORS = `const DARK = {
  ink: '#f4ede0',
  paper: '#1f1d1a',
  page: '#12110f',
  yellow: '#f2df8a',
  pink: '#f0a6d6',
  blue: '#9fb4f5',
  onAccent: '#111111',
  focus: '#b3c5ff',
} as const;

const COLORS = Appearance.getColorScheme() === 'dark' ? DARK : LIGHT;

`;

export const DARK_THEME_README = `The colors follow the theme of the system when the app starts. \`src/shared-features/theme/ThemeConfig.ts\` holds a light and a dark set of the same color tokens and picks one through \`Appearance\`, so a component never picks a color per theme. The pastel accents carry dark text in both themes (\`onAccent\`) and the other surfaces the ink of the theme, so text keeps a contrast of at least 4.5:1 everywhere. A theme change while the app runs shows at the next start.

`;

export const REACT_COMPILER_DOC = `\`app.json\` turns on the [React Compiler](https://react.dev/learn/react-compiler) (\`experiments.reactCompiler\`), which \`babel-preset-expo\` runs through \`babel-plugin-react-compiler\` when Metro bundles the app, so components and hooks are memoized at build time. \`oxlint.config.ts\` reports \`useMemo\`, \`useCallback\` and \`memo\` imported from \`react\`.

`;

export const ANALYTICS_MODULE_README = `## Analytics

\`src/shared/analyticsClient.ts\` is the only place where events leave the app: \`analyticsClient.track('todo_added', { source: 'form' })\`. It sends nothing yet: it emits an \`analytics\` event on \`DeviceEventEmitter\` with the name and the properties, for the tool you plug in there. Replace its body with your SDK, and dependency-cruiser keeps that SDK inside this file.

`;

export const ANALYTICS_POSTHOG_README = `## Analytics

\`src/shared/analyticsClient.ts\` is the only place where events leave the app: \`analyticsClient.track('todo_added', { source: 'form' })\` sends them to PostHog through \`posthog-react-native\`. Set \`EXPO_PUBLIC_POSTHOG_KEY\` in \`.env.local\`, which git ignores, and \`EXPO_PUBLIC_POSTHOG_HOST\` for another host than \`https://eu.i.posthog.com\`. Without a key nothing is sent, in dev or in the tests. Expo writes these values into the bundle when Metro starts, so restart it after a change.

`;

export const COVERAGE_JEST = `    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/app/**",
      "!**/*.test.{ts,tsx}",
      "!**/*{Container,Layout,Page}.tsx",
      "!**/use[A-Z]*.ts",
      "!**/*{Client,Keys,Types,Config,Schemas,Storage}.ts"
    ],
    "coverageReporters": ["text"],
    "coverageThreshold": {
      "global": { "lines": 90, "functions": 90, "branches": 90, "statements": 90 }
    },
`;

export const COVERAGE_DOC = `\`npm test\` also measures coverage and fails under 90 % of the lines, functions, branches or statements of what Jest is meant to test: presenters, pure functions, selectors and stores. Orchestrators, hooks, clients, \`xStorage.ts\` files and \`src/app/\` are left out (\`jest\` in \`package.json\`), since they need the device. \`npm run test:watch\` runs without it.

`;

export const TESTS_PARAGRAPH =
  '`npm test` runs both with Jest and the `jest-expo` preset, which mocks the native side of React Native: Vitest does not run React Native yet. The component tests use [React Native Testing Library](https://oss.callstack.com/react-native-testing-library/), whose `render` and `userEvent` are async. Only presenters get component tests, since orchestrators read stores. Find elements by role and accessible name. ';

export const EXPO_GO_README = `\`npm start\` prints a QR code: scan it with [Expo Go](https://expo.dev/go) on a phone, or press \`a\` or \`i\` for an Android emulator or the iOS simulator, and \`w\` for the browser. Nothing native is built, so no Android SDK or Xcode is needed. [Running on a device](docs/guides/run-on-a-device.md) says when to move to a development build.`;

export const DEV_BUILD_README =
  '`npm run android` builds the development build of the app and opens it on an Android emulator or a phone plugged in over USB. It needs the Android SDK; [Running on a device](docs/guides/run-on-a-device.md) covers iOS, WSL2 and the setup. To try the app without installing anything native, `npm run start:go` opens it in Expo Go and `npm run web` in the browser.';

export const EXPO_GO_COMMANDS = `| \`npm start\` | Metro, with a QR code for Expo Go: \`a\` opens an Android emulator, \`i\` the iOS simulator, \`w\` the browser |
| \`npm run android\`, \`npm run ios\`, \`npm run web\` | Metro, opened on one platform |`;

export const DEV_BUILD_COMMANDS = `| \`npm run android\`, \`npm run ios\` | builds the development build, installs it on an emulator, a simulator or a USB device, and starts Metro |
| \`npm start\` | Metro alone, for a development build already installed |
| \`npm run phone\` | the development build on a USB Android phone, through the adb of \`ADB\` (\`scripts/phone.ts\`) |
| \`npm run start:go\` | Metro for Expo Go |
| \`npm run web\` | the app in the browser |`;
