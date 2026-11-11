# Translations

Every string the user reads goes through [i18next](https://www.i18next.com), even with a single language: `t('add')`, not `Add`.

The messages are JSON, one file per language and namespace in `src/app/locales/en/`, and each slice has its own namespace (`app`, `todoList`, `todoStats`). `src/app/createI18n.ts` imports them. `src/app/I18nProvider.tsx` hands an instance to the client components through `useTranslation`, and the server components (`src/app/page.tsx`, the metadata in `src/app/layout.tsx`) call `createI18n().getFixedT()` themselves, since a server component cannot use a hook.

## Add a language

To add a language, add its folder next to `src/app/locales/en/`, import its files in `src/app/createI18n.ts` and list it under `locales` in `i18next.config.ts`.
