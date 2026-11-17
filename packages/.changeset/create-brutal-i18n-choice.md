---
'create-brutal': minor
---

`--i18n` takes a value on vite, next and react-native: `en`, the default, gives the projects of today, `en-fr` replaces the old `--i18n`, and `none` leaves i18next out for an app in a single language, with the English texts written in the components. `--i18n` without a value, `--no-i18n` and `"i18n": true` in a preset are refused. On next, the instrumentation files leave the coverage, as `src/proxy.ts` does.
