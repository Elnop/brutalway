---
'template-react-native': patch
---

`oxlint.config.ts` extends `@brutalway/oxlint-config-react-native`: a color, a size, a spacing, a font or a shadow in a `StyleSheet.create` comes from `THEME`, a `style` prop takes no object written inline, and the rules of `eslint-plugin-react-native` run. `accessibilityLabel` and `accessibilityHint` go through `t()`.
