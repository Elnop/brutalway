# template-react-native

## 0.1.1

### Patch Changes

- d8ea465: `oxlint.config.ts` extends `@brutalway/oxlint-config-react-native`: a color, a size, a spacing, a font or a shadow in a `StyleSheet.create` comes from `THEME`, a `style` prop takes no object written inline, and the rules of `eslint-plugin-react-native` run. `accessibilityLabel` and `accessibilityHint` go through `t()`.

## 0.1.0

### Minor Changes

- a83ae11: First version of template-react-native: the todo list of the other templates on Expo, with Expo Router, for iOS, Android and the web build. It runs in a development build (`npm run android`, `npm run ios`, and `npm run phone` for a USB phone that the adb of the SDK does not see, as on WSL2), with Expo Go kept as an option. The routes sit in `src/app/screens/`, the neo-brutalist tokens are a TypeScript theme in `src/shared/theme/ThemeConfig.ts`, and the todos are kept on the device through zustand and AsyncStorage. `npm run check` runs as on the web templates, without stylelint, and the tests run on Jest with React Native Testing Library.
