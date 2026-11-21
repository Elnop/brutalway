# @brutalway/oxlint-config-react-native

Oxlint preset for React Native and Expo apps. It extends [@brutalway/oxlint-config-react](https://www.npmjs.com/package/@brutalway/oxlint-config-react) and [@brutalway/oxlint-config-zustand](https://www.npmjs.com/package/@brutalway/oxlint-config-zustand), and checks what stylelint checks on the web: every color, size, spacing, font and shadow of a style comes from a theme object. It also loads [eslint-plugin-react-native](https://github.com/Intellicode/eslint-plugin-react-native) as a JS plugin, turns on the `jest` plugin of oxlint, and leaves the files of Expo Router out of the rules on names and exports.

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-react-native
```

```ts
import { reactNativeConfig } from '@brutalway/oxlint-config-react-native';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactNativeConfig],
});
```

## Usage

The config does not know where your theme lives. It only rejects literals inside `StyleSheet.create`, so the theme can be any object outside of it, like a `THEME` constant in a `ThemeConfig.ts`:

```ts
const styles = StyleSheet.create({
  card: {
    padding: THEME.spacing.l,
    backgroundColor: THEME.colors.yellow,
    boxShadow: THEME.shadows.large,
  },
});
```

A theme that changes at runtime, light and dark for instance, builds the sheet in a function that takes the theme. `no-unused-styles` matches a sheet to its uses by the name of its variable, file by file: the function assigns the sheet to `styles` before returning it, and the component calls the result `styles` too. A sheet returned without a name has every entry reported as unused.

```ts
export function Card() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return <View style={styles.card} />;
}

function createStyles(theme: Theme) {
  const styles = StyleSheet.create({
    card: { padding: theme.spacing.l, backgroundColor: theme.colors.background },
  });
  return styles;
}
```

When a rule fires:

- a color, a size or a font in `StyleSheet.create`: add a token to the theme if it is missing, and use it
- an object in a `style` prop, or in any prop ending in `Style`: move it into the `StyleSheet.create` of the file. A style that depends on a prop picks one of several entries of the sheet, each written out (`styles.paper`, `styles.yellow`): `no-unused-styles` does not see an entry read as `styles[tone]`
- text outside `<Text>`: wrap it, React Native throws on raw text at runtime
- an unused entry of `StyleSheet.create`: delete it

## Rules

- in `StyleSheet.create`, no literal for a color (any key ending in `color` or `Color`, `transparent` aside), a size or a spacing (margins, paddings, gaps, positions, widths, heights, `flexBasis`, font size, line height, letter spacing, border widths and radii), a `fontFamily`, a `boxShadow` or a `textShadow` (`none` aside). `0` and percentages stay literal, and so do the keys without a unit, like `flex` or `opacity`
- no object written in a `style` prop or a prop ending in `Style`
- from eslint-plugin-react-native: `no-raw-text`, `no-unused-styles`, `no-single-element-style-arrays` and `split-platform-components` (a component ending in `IOS` or `Android` lives in a `.ios.tsx` or `.android.tsx` file)
- in tests: `it()` inside a `describe`, `toStrictEqual` over `toEqual`, `toBe` for primitives, `toHaveBeenCalledWith` over `toHaveBeenCalled`, an error message in `toThrow`, no `.only`
- the files of `src/app/`, the routes of Expo Router, are left out of the rules on file names, exports and props: Expo Router picks the file name (`_layout.tsx`, `index.tsx`, `+not-found.tsx`, `hello+api.ts`, `[id].tsx`, a kebab-case route that becomes its URL), the default or named exports (`GET`, `ErrorBoundary`, `unstable_settings`, `generateStaticParams`, `redirectSystemPath`) and the props. The other rules, styles and raw text included, still apply to them. Expo Router reads its routes from `src/app/` by default, and the application code lives in `features/` and `shared/`
- no relative imports: import through the aliases of `tsconfig.json`
- `import/default` and `typescript/no-non-null-assertion` off
- `.expo`, `android`, `ios`, `dist` and `expo-env.d.ts` ignored, and the `node` env for `*.config.ts`, `*.config.js` and `jest.setup.ts`

## Why

A theme only holds if nothing goes around it. On the web, stylelint rejects a color outside the custom properties. React Native has no CSS, so the same check runs on the style objects. An inline style object would escape it, and React Native creates a new object for it on every render.
