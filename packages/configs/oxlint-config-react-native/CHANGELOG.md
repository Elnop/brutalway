# @brutalway/oxlint-config-react-native

## 0.1.0

### Minor Changes

- 7b4e31b: First version of `@brutalway/oxlint-config-react-native`, the oxlint preset for React Native and Expo apps. It extends the React and zustand configs. In `StyleSheet.create`, a color, a size, a spacing, a font or a shadow comes from the theme, with no literal, and a `style` prop takes no object written inline. It runs `no-raw-text`, `no-unused-styles`, `no-single-element-style-arrays` and `split-platform-components` from eslint-plugin-react-native, the Jest rules of oxlint, and lets the route files of Expo Router export a default.
