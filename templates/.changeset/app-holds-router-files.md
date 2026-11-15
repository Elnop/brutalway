---
'template-vite': minor
'template-next': minor
'template-react-native': minor
---

The i18n setup is the `src/features/i18n/` feature (`createI18n.ts`, and `I18nProvider.tsx` on next and react-native), and the messages move out of `src/` into `locales/` at the root of the project, imported through the `@locales/*` alias. On next and react-native, `src/app/` now holds only what the router reads, plus `globals.css` on next. React Native drops the `root` option of the `expo-router` plugin, which the Expo docs advise against: the routes move from `src/app/screens/` to `src/app/`, where Expo Router looks by default.
