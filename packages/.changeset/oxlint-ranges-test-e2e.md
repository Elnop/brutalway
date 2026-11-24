---
'@brutalway/oxlint-config-react': patch
'@brutalway/oxlint-config-node': patch
'@brutalway/oxlint-config-zustand': patch
'@brutalway/oxlint-config-react-vite': patch
'@brutalway/oxlint-config-next': patch
'@brutalway/oxlint-config-react-native': patch
---

`@brutalway/oxlint-config-typescript` goes from `^0.8.0` to `^0.9.0` and `@brutalway/oxlint-config-react` from `^0.5.0` to `^0.6.0`, so a project that extends react-vite, next or react-native gets the overrides of `test/e2e/**`.
