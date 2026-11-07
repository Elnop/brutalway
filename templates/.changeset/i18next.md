---
'template-vite': minor
---

Every visible string goes through i18next, in English only. The messages are JSON in `src/app/locales/en/`, one namespace per slice (`app`, `todoList`, `todoStats`), `src/app/createI18n.ts` builds the instance and `src/main.tsx` wraps the app in an `I18nextProvider`. `npm run typecheck` first runs `i18next-cli types` into `node_modules/.cache/i18next/`, so an unknown key or a missing `{{title}}` is a tsc error, and `npm run messages` (in `check`) fails on a missing or unused key. `@brutalway/oxlint-config-i18next` reports visible text in JSX, in `aria-label`, `placeholder`, `title` and `alt`, and in template literals. `vitest.setup.ts` gives the tests the same instance. `countLabel.ts` gives way to i18next plurals, so `normalizeTitle.ts` moves up to `src/shared/`, and `TODO_FILTERS` only lists the filters.
