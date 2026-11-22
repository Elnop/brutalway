---
'@brutalway/oxlint-config-react-native': patch
---

Colors are reported anywhere outside a `*ThemeConfig.ts` file, not only in `StyleSheet.create`: hex strings, `rgb(`, `rgba(`, `hsl(` and `hsla(` strings and templates, and a CSS color name given to a prop or a key ending in `color`. `fontWeight` in a `StyleSheet.create` is reported, since a custom font on Android has a single weight. AsyncStorage is only imported in an `xStorage.ts` file. `designSystemPrimitives({ components, files })`, from `@brutalway/oxlint-config-react-native/designSystemPrimitives`, reserves react-native components to the design system, off unless a project adds it.
