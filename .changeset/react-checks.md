---
'@brutalway/oxlint-config-typescript': minor
'@brutalway/oxlint-config-react': minor
'@brutalway/oxlint-config-i18next': patch
'create-brutal': minor
---

`@brutalway/oxlint-config-typescript` reports a function whose cognitive complexity is above 15 with Sonar's own rule, `sonarjs/cognitive-complexity`. The whole `eslint-plugin-sonarjs` does not load under Oxlint with TypeScript 7, so a small plugin loads the file of that rule alone, from an exact version of the package.

`@brutalway/oxlint-config-react` adds rules taken from bedrock: no array index as a `key`, `localStorage` and `sessionStorage` only in an `xStorage.ts` file, no `useX.tsx` hook file, no formatting (`toFixed`, `Intl`, `sort`, `filter`, `reduce`...) in a presenter, an orchestrator that calls at least one hook, and at most 6 props per component.

`@brutalway/oxlint-config-i18next` leaves test files alone, since they pass literal props to what they render.

New `coverage` option on vite, off by default, which needs component tests: `npm test` runs `vitest run --coverage` and fails under 90 % of presenters, pure functions, selectors and stores. With `i18n`, `LanguageSwitch.tsx` gets its component test, and `languagePreference.ts` becomes `languageStorage.ts`.
