# Translations

Every string the user reads goes through [i18next](https://www.i18next.com), even with a single language: `t('add')`, not `Add`.

The messages are JSON, one file per language and namespace, in the `locales/<language>/` folder of the feature that owns them: `src/features/todo-list/locales/en/todoList.json`, and `src/app/locales/en/app.json` for the text of the app itself. A namespace is named after its feature folder (`todoList` for `todo-list`), and `i18next.config.ts` fails on a namespace with no matching folder. `src/createI18n.ts` imports them, and `src/I18nProvider.tsx`, which `src/app/_layout.tsx` renders around every screen, hands the instance to the components through `useTranslation`.

## Add a language

To add a language, add a `locales/<language>/` folder next to each `locales/en/`, import its files in `src/createI18n.ts` and list it under `locales` in `i18next.config.ts`.
