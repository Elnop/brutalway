---
'create-brutal': minor
---

The overlays follow the templates: the i18n setup lives in `src/features/i18n/`, the messages in `locales/`, and the routes of react-native in `src/app/`. With `--i18n` on react-native, the languages, their storage and `pickLanguage` move into `src/shared-features/language/`, since `src/features/i18n/` and `src/features/language-switch/` both use them and a feature cannot import another one.
