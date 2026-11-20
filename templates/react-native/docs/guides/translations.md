# Translations

Every string the user reads goes through [i18next](https://www.i18next.com), even with a single language: `t('add')`, not `Add`.

The messages are JSON, one file per language and namespace in `locales/en/`, and each feature has its own namespace (`app`, `todoList`, `todoStats`). `src/features/i18n/createI18n.ts` imports them, and `src/features/i18n/I18nProvider.tsx`, which `src/app/_layout.tsx` renders around every screen, hands the instance to the components through `useTranslation`.

## Add a language

To add a language, add its folder next to `locales/en/`, import its files in `src/features/i18n/createI18n.ts` and list it under `locales` in `i18next.config.ts`.
