---
'@brutalway/oxlint-config-i18next': patch
---

A literal `aria-description` on a native tag (`<div aria-description="Pet details" />`) is reported, as `i18next-attributes(no-restricted-syntax)`. eslint-plugin-i18next only checks its own list of attributes on native tags and skipped it. On a component the plugin still reports it, once.
