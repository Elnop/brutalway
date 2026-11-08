# @brutalway/oxlint-config-i18next

## 0.2.0

### Minor Changes

- 583202b: Every vite project now goes through i18next, whatever its options: the presenters of each styling value call `t()`, and a project without the example keeps an `app` namespace with its title. With `forms`, the messages of `TodoDraftSchema` are keys listed in `TITLE_ERRORS`, translated by `useTitleForm`.
  
  `@brutalway/oxlint-config-i18next` is a new package that runs `no-literal-string` from `eslint-plugin-i18next` as an Oxlint JS plugin: visible text in JSX, in `aria-label`, `aria-description`, `placeholder`, `title` and `alt`, and in template literals is reported, while a string without letters (`42%`, `×`) is not.

### Patch Changes

- e0acd39: A literal `aria-description` on a native tag (`<div aria-description="Pet details" />`) is reported, as `i18next-attributes(no-restricted-syntax)`. eslint-plugin-i18next only checks its own list of attributes on native tags and skipped it. On a component the plugin still reports it, once.
- f1b60f3: `@brutalway/oxlint-config-typescript` reports a function whose cognitive complexity is above 15 with Sonar's own rule, `sonarjs/cognitive-complexity`. The whole `eslint-plugin-sonarjs` does not load under Oxlint with TypeScript 7, so a small plugin loads the file of that rule alone, from an exact version of the package.
  
  `@brutalway/oxlint-config-react` adds rules taken from bedrock: no array index as a `key`, `localStorage` and `sessionStorage` only in an `xStorage.ts` file, no `useX.tsx` hook file, no formatting (`toFixed`, `Intl`, `sort`, `filter`, `reduce`...) in a presenter, an orchestrator that calls at least one hook, and at most 6 props per component.
  
  `@brutalway/oxlint-config-i18next` leaves test files alone, since they pass literal props to what they render.
  
  New `coverage` option on vite, off by default, which needs component tests: `npm test` runs `vitest run --coverage` and fails under 90 % of presenters, pure functions, selectors and stores. With `i18n`, `LanguageSwitch.tsx` gets its component test, and `languagePreference.ts` becomes `languageStorage.ts`.
