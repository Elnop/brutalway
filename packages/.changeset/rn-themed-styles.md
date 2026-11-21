---
'@brutalway/oxlint-config-react-native': patch
---

The README shows how to build the styles of a theme that changes at runtime so that `no-unused-styles` still sees their uses: the function that creates the sheet assigns it to `styles` before returning it.
