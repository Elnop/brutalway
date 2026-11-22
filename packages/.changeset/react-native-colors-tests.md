---
'@brutalway/oxlint-config-react-native': patch
---

Colors are a rule of their own, `theme-colors`. A template literal with expressions computes a color and is no longer reported, and `colorFiles([...])`, from `@brutalway/oxlint-config-react-native/colorFiles`, lets a project name the modules that work on colors. Tests may import AsyncStorage to seed or clear it, and `designSystemPrimitives` skips type-only imports.
