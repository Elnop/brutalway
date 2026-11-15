---
'@brutalway/oxlint-config-react-native': minor
---

The files of `src/app/`, the routes of Expo Router, are left out of the rules on file names, exports and props. This replaces the rule on the `.tsx` files of `app/` whose name starts with a lowercase letter, which rejected `+not-found.tsx`, `+native-intent.tsx`, kebab-case routes, and the `.ts` routes `+middleware.ts` and `hello+api.ts`. A component in PascalCase inside `src/app/` is no longer checked as application code: it belongs in a feature. A fixture holds every file convention of Expo Router and must lint clean.
