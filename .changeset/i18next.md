---
'create-brutal': minor
'@brutalway/oxlint-config-i18next': minor
---

Every vite project now goes through i18next, whatever its options: the presenters of each styling value call `t()`, and a project without the example keeps an `app` namespace with its title. With `forms`, the messages of `TodoDraftSchema` are keys listed in `TITLE_ERRORS`, translated by `useTitleForm`.

`@brutalway/oxlint-config-i18next` is a new package that runs `no-literal-string` from `eslint-plugin-i18next` as an Oxlint JS plugin: visible text in JSX, in `aria-label`, `aria-description`, `placeholder`, `title` and `alt`, and in template literals is reported, while a string without letters (`42%`, `×`) is not.
