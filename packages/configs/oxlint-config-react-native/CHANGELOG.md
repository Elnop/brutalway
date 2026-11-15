# @brutalway/oxlint-config-react-native

## 0.2.0

### Minor Changes

- 1361754: The files of `src/app/`, the routes of Expo Router, are left out of the rules on file names, exports and props. This replaces the rule on the `.tsx` files of `app/` whose name starts with a lowercase letter, which rejected `+not-found.tsx`, `+native-intent.tsx`, kebab-case routes, and the `.ts` routes `+middleware.ts` and `hello+api.ts`. A component in PascalCase inside `src/app/` is no longer checked as application code: it belongs in a feature. A fixture holds every file convention of Expo Router and must lint clean.

## 0.1.0

### Minor Changes

- 7b4e31b: First version of `@brutalway/oxlint-config-react-native`, the oxlint preset for React Native and Expo apps. It extends the React and zustand configs. In `StyleSheet.create`, a color, a size, a spacing, a font or a shadow comes from the theme, with no literal, and a `style` prop takes no object written inline. It runs `no-raw-text`, `no-unused-styles`, `no-single-element-style-arrays` and `split-platform-components` from eslint-plugin-react-native, the Jest rules of oxlint, and lets the route files of Expo Router export a default.
