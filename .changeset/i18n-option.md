---
'create-brutal': minor
---

New `i18n` option on vite, off by default: the project comes in English and French, with English and Français buttons in the header (a `Button` with `--ui shadcn`). `src/features/language-switch/` holds the switch, the list of languages and `languagePreference.ts`, which starts from the language saved in `localStorage`, or else the first language of the browser the project has, and keeps `<html lang>` and the title of the page in line. `i18next-cli status` then checks that French has every key, and with e2e, `e2e/language.spec.ts` switches to French, runs axe and reloads.
