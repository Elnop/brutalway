---
'@brutalway/oxlint-config-i18next': minor
---

More visible text is reported. A project fixes what the lint reports by moving the text to `locales/en/` and rendering `t('key')`. The new cases are the `value` of an `<input type="submit">`, `button` or `reset`, `aria-placeholder`, `aria-roledescription` and `aria-valuetext` on native tags and on components, and a literal or a template literal given to `toast(...)`, `toast.<method>(...)`, `alert`, `confirm`, `prompt`, or assigned to `document.title`. Test files named `*.test.ts` are left alone, like `*.test.tsx`.
