# @brutalway/oxlint-config-react-native

## 0.3.2

### Patch Changes

- 8f4a1ee: Colors are reported anywhere outside a `*ThemeConfig.ts` file, not only in `StyleSheet.create`: hex strings, `rgb(`, `rgba(`, `hsl(` and `hsla(` strings and templates, and a CSS color name given to a prop or a key ending in `color`. `fontWeight` in a `StyleSheet.create` is reported, since a custom font on Android has a single weight. AsyncStorage is only imported in an `xStorage.ts` file. `designSystemPrimitives({ components, files })`, from `@brutalway/oxlint-config-react-native/designSystemPrimitives`, reserves react-native components to the design system, off unless a project adds it.
- Updated dependencies [bcca4c7]
- Updated dependencies [98f97a7]
  - @brutalway/oxlint-config-react@0.5.3
  - @brutalway/oxlint-config-zustand@0.3.1

## 0.3.1

### Patch Changes

- d431307: The README shows how to build the styles of a theme that changes at runtime so that `no-unused-styles` still sees their uses: the function that creates the sheet assigns it to `styles` before returning it.

## 0.3.0

### Minor Changes

- f38543b: `@brutalway/oxlint-config-react-vite`, `-next` and `-react-native` move to `@brutalway/oxlint-config-react` `^0.5.0` and `@brutalway/oxlint-config-zustand` `^0.3.0`, and `@brutalway/oxlint-config-fastify` to `@brutalway/oxlint-config-node` `^0.3.0`. They all reach `@brutalway/oxlint-config-typescript` 0.8.0:

  - `export default` is rejected, except in the files a tool loads by their default export and the files the framework names (`src/app/` on next and react-native)
  - no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`

## 0.2.0

### Minor Changes

- 1361754: The files of `src/app/`, the routes of Expo Router, are left out of the rules on file names, exports and props. This replaces the rule on the `.tsx` files of `app/` whose name starts with a lowercase letter, which rejected `+not-found.tsx`, `+native-intent.tsx`, kebab-case routes, and the `.ts` routes `+middleware.ts` and `hello+api.ts`. A component in PascalCase inside `src/app/` is no longer checked as application code: it belongs in a feature. A fixture holds every file convention of Expo Router and must lint clean.

## 0.1.0

### Minor Changes

- 7b4e31b: First version of `@brutalway/oxlint-config-react-native`, the oxlint preset for React Native and Expo apps. It extends the React and zustand configs. In `StyleSheet.create`, a color, a size, a spacing, a font or a shadow comes from the theme, with no literal, and a `style` prop takes no object written inline. It runs `no-raw-text`, `no-unused-styles`, `no-single-element-style-arrays` and `split-platform-components` from eslint-plugin-react-native, the Jest rules of oxlint, and lets the route files of Expo Router export a default.
